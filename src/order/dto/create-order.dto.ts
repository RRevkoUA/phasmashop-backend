import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString, Min } from 'class-validator';
import { DeliveryTypes } from 'src/common/enums';
import { DeliveryStatus } from 'src/common/enums/delivery-status.enum';

export class CreateOrderDto {
  @ApiProperty({
    example: DeliveryTypes.MEEST,
    description: 'The type of delivery',
    required: true,
    default: 'Delivery',
    enum: DeliveryTypes,
  })
  @IsEnum(DeliveryTypes)
  deliveryType: DeliveryTypes;

  @ApiProperty({
    example: DeliveryStatus.DELIVERED,
    description: 'The status of delivery',
    enum: DeliveryStatus,
  })
  @IsEnum(DeliveryStatus)
  deliveryStatus: DeliveryStatus;

  @ApiProperty({
    example: '111111111',
    description: 'The waybill number',
    required: true,
  })
  @IsString()
  waybill: string;

  @ApiProperty({
    example: '60f7b1b4b3f1d3f7b4b3f1d3',
    description: 'The user id',
    required: true,
  })
  @IsString()
  userId: string;

  @ApiProperty({
    example: ['60f7b1b4b3f1d3f7b4b3f1d3', '60f7b1b4b3f1d3f7b4b3f1d3'],
    description: 'The array of products id',
    required: true,
    isArray: true,
    type: String,
  })
  @IsString({ each: true })
  products: string[];

  @ApiProperty({
    example: 100000,
    description: 'The total price of products',
    required: true,
  })
  @Min(1)
  @IsNumber()
  price: number;
}
