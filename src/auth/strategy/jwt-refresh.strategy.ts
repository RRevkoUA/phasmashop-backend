import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Model } from 'mongoose';
import { User } from 'src/schemas/users.schema';
import { Request } from 'express';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    config: ConfigService,
    @InjectModel(User.name) private userModule: Model<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_REFRESH_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: { sub: number; email: string }) {
    const user = await this.userModule.findOne({
      email: payload.email,
    });
    if (!user) {
      throw new UnauthorizedException(
        'Authentication failed. Please provide a valid token.',
      );
    }
    user.hash = undefined;
    user.hashedRt = undefined;

    const refresh_token = req
      .get('Authorization')
      .replace('Bearer ', '')
      .trim();

    return {
      user,
      refresh_token,
    };
  }
}
