import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { EncryptionService } from '../../encryption/encryption.service';

@Injectable()
export class DecryptionMiddleware implements NestMiddleware {
  constructor() {}

  async use(req: Request, res: Response, next: NextFunction) {
    const encryptionService = new EncryptionService();

    if (req.body) {
      let encryptedText = req.body;
      try {
        if (req.body instanceof Object) {
          encryptedText = JSON.stringify(req.body);
        }
        req.body = await encryptionService.decrypt(encryptedText);
        req.body = JSON.parse(req.body);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
      }
    }

    next();
  }
}
