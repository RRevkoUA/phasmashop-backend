import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/common/schemas/User.schema';
import { JwtStrategy, JwtRefreshStrategy } from '../common/strategy';
import { UserSeed } from 'src/common/seeders/user.seeder';

@Module({
  imports: [
    JwtModule.register({}),
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtRefreshStrategy, UserSeed],
  exports: [UserSeed],
})
export class AuthModule {}
