import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { SigninAuthDto, SignupAuthDto } from './dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/common/schemas/User.schema';
import { Model, Types } from 'mongoose';
import { isEmail } from 'class-validator';
import { Tokens } from './types';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    @InjectModel(User.name) private userModule: Model<User>,
  ) {}

  async signup(dto: SignupAuthDto): Promise<Tokens> {
    try {
      const token = await argon.hash(dto.password);
      const user = await this.userModule.create({
        ...dto,
        hash: token,
      });
      const tokens = await this.signTokens(user._id, user.email);
      await this.refreshRtHash(user._id, tokens.refresh_token);
      return tokens;
    } catch (err) {
      if (err.code === 11000) {
        const res = Object.values(err.keyValue)[0];
        throw new ForbiddenException(`${res} is already in use`);
      }
      throw err;
    }
  }

  async signin(dto: SigninAuthDto): Promise<Tokens> {
    let user;

    if (isEmail(dto.login)) {
      user = await this.userModule.findOne({
        email: dto.login,
      });
    } else {
      user = await this.userModule.findOne({
        username: dto.login,
      });
    }
    if (!user) {
      throw new ForbiddenException('Credentials incorrect');
    }
    const isCorrectPassword = await argon.verify(user.hash, dto.password);

    if (!isCorrectPassword) {
      throw new ForbiddenException('Credentials incorrect');
    }
    const tokens = await this.signTokens(user._id, user.email);
    await this.refreshRtHash(user._id, tokens.refresh_token);
    return tokens;
  }

  async logout(user: User) {
    await this.userModule.findOneAndUpdate(user, { hashedRt: null });
  }

  async refreshTokens(user: User, refresh_token: string) {
    const userObj = await this.userModule.findOne({ email: user.email });
    if (!userObj) {
      throw new ForbiddenException('Invalid user');
    }
    const rtMaches = await argon.verify(userObj.hashedRt, refresh_token);
    if (!rtMaches) {
      throw new ForbiddenException('Invalid refresh token');
    }
    const tokens = await this.signTokens(userObj._id, user.email);
    await this.refreshRtHash(userObj._id, tokens.refresh_token);
    return tokens;
  }

  async refreshRtHash(userId: Types.ObjectId, refreshToken: string) {
    const hash = await argon.hash(refreshToken);
    await this.userModule.updateOne({ _id: userId }, { hashedRt: hash });
  }

  async signTokens(userId: Types.ObjectId, email: string): Promise<Tokens> {
    const payload = {
      sub: userId.toHexString,
      email,
    };

    const access_token = await this.jwt.signAsync(payload, {
      expiresIn: process.env.JWT_TOKEN_EXPIRES_IN,
      secret: process.env.JWT_SECRET,
    });

    const refresh_token = await this.jwt.signAsync(payload, {
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
      secret: process.env.JWT_REFRESH_SECRET,
    });

    return {
      access_token,
      refresh_token,
    };
  }
}
