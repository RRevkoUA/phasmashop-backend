import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { AuthDto } from './dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/users.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    @InjectModel(User.name) private userModule: Model<User>,
  ) {}

  async signup(dto: AuthDto) {
    try {
      const token = await argon.hash(dto.password);
      const user = await this.userModule.create({
        ...dto,
        hash: token,
      });
      return this.signToken(user._id, user.email);
    } catch (err) {
      if (err.code === 11000) {
        throw new ForbiddenException('this username or email already in use');
      }
      throw err;
    }
  }

  async signin(dto: AuthDto) {
    const user = await this.userModule.findOne({ email: dto.email });

  }

  async signToken(userId: Types.ObjectId, email: string): Promise<object> {
    const payload = {
      sub: userId.toHexString,
      email,
    };

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: process.env.JWT_SECRET,
    });

    return {
      access_token: token,
    };
  }
}
