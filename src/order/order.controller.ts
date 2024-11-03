import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto, UpdateOrderDto } from './dto';
import { ApiTags } from '@nestjs/swagger';
import { GetUser, Role } from 'src/common/decorator';
import { User } from 'src/common/schemas';
import { Document } from 'mongoose';
import { RoleEnum } from 'src/common/enums';

@Role(RoleEnum.USER)
@ApiTags('Order')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(
    @Body() createOrderDto: CreateOrderDto,
    @GetUser() user: User & Document,
  ) {
    return this.orderService.create(createOrderDto, user);
  }

  @Get('all')
  findAll() {
    return this.orderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetUser() user: User & Document) {
    return this.orderService.findOne(id, user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @GetUser() user: User & Document,
  ) {
    return this.orderService.update(id, updateOrderDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user: User & Document): Promise<any> {
    return this.orderService.remove(id, user);
  }
}
