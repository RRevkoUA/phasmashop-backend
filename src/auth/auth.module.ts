import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/users.schema';
import { JwtStrategy } from './strategy';
import { UserSeed } from 'src/seeders/user.seeder';

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
  providers: [AuthService, JwtStrategy, UserSeed],
})
export class AuthModule {}
