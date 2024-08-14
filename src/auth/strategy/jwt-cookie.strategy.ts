import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Model } from 'mongoose';
import { User } from 'src/schemas/users.schema';

@Injectable()
export class JwtCookieStrategy extends PassportStrategy(
  Strategy,
  'jwt-cookie',
) {
  constructor(
    config: ConfigService,
    @InjectModel(User.name) private userModule: Model<User>,
  ) {
    super({
      //use cookie instead of Authorization header
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          let token = null;
          if (req && req.cookies) {
            token = req.cookies['access_token'];
            console.log(token);
          }
          return token;
        },
      ]),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: { sub: number; email: string }) {
    console.log('payload', payload);
    const user = await this.userModule.findOne({
      email: payload.email,
    });
    if (!user || !user.hashedRt) {
      throw new UnauthorizedException(
        'Authentication failed. Please provide a valid token.',
      );
    }
    user.hash = undefined;
    return user;
  }
}
