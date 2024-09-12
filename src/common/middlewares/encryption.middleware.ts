import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { EncryptionService } from '../../encryption/encryption.service';

@Injectable()
export class EncryptionMiddleware implements NestMiddleware {
  constructor() {}

  async use(req: Request, res: Response, next: NextFunction) {
    const encryptionService = new EncryptionService();
    if (req.body.length) {
      let encryptedText = req.body;
      try {
        if (req.body instanceof Object) {
          encryptedText = JSON.stringify(req.body);
        }
        req.body = await encryptionService.encrypt(encryptedText);
      } catch (error) {
        console.error(error);
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ error: error.message });
      }
    }
    next();
  }
}
