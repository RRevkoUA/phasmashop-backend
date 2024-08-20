import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Model } from 'mongoose';
import { User } from 'src/common/schemas/User.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    @InjectModel(User.name) private userModule: Model<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          if (req && req.cookies) {
            return req.cookies['access_token'];
          }
          return null;
        },
      ]),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: { sub: number; email: string }) {
    const user = await this.userModule.findOne({
      email: payload.email,
    });

    if (!user || !user.hashedRt) {
      throw new UnauthorizedException(
        'Authentication failed. Please provide a valid token.',
      );
    }
    user.hash = undefined;
    user.hashedRt = undefined;
    return user;
  }
}
