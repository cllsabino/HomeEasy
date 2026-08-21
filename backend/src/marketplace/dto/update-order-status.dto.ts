import { IsEnum } from 'class-validator';

import { OrderStatus } from '../marketplace.enums';

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
