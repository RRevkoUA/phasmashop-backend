import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { EncryptionService } from 'src/encryption/encryption.service';

export const Decrypt = createParamDecorator(
  async (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    let encryptedText = request.body;

    if (request.body instanceof Object) {
      encryptedText = JSON.stringify(request.body);
    }

    const encryptionService = new EncryptionService();
    const decryptedText = await encryptionService.decrypt(encryptedText);
    return JSON.parse(decryptedText);
  },
);
