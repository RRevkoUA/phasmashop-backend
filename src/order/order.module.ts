import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from 'src/common/schemas/Order.schema';
import { OrderSeed } from 'src/common/seeders/order.seeder';
import { AuthModule } from 'src/auth/auth.module';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Order.name,
        schema: OrderSchema,
      },
    ]),
    AuthModule,
    ProductModule,
  ],
  controllers: [OrderController],
  providers: [OrderService, OrderSeed],
  exports: [OrderService, OrderSeed],
})
export class OrderModule {}
