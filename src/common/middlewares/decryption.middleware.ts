import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { EncryptionService } from '../../encryption/encryption.service';

@Injectable()
export class DecryptionMiddleware implements NestMiddleware {
  constructor() {}

  async use(req: Request, res: Response, next: NextFunction) {
    const encryptionService = new EncryptionService();
    if (Object.keys(req.body).length === 1 && req.body.encryptedData) {
      try {
        const decryptedData = await encryptionService.decrypt(
          req.body.encryptedData,
        );
        req.body = JSON.parse(decryptedData);
        Logger.debug('Decrypted data:', req.body);
      } catch (error) {
        Logger.error(error);
        return res.status(500).json({ error: error.message });
      }
    }
    next();
  }
}
