import { BadRequestException } from '@nestjs/common';

import { SendMessageDto } from './dto/send-message.dto';
import { MessageType } from './communication.enums';

export function validateMessage(message: SendMessageDto) {
  if (message.type === MessageType.Text && !message.content?.trim()) {
    throw new BadRequestException('Escreva uma mensagem antes de enviar.');
  }
  if (message.type === MessageType.Budget && message.budgetAmount === undefined) {
    throw new BadRequestException('Informe o valor do orçamento.');
  }
  if (message.type === MessageType.Image) {
    throw new BadRequestException('Solicite primeiro uma URL segura para enviar a imagem.');
  }
}
