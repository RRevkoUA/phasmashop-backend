import { Injectable } from '@nestjs/common';
import {
  createCipheriv,
  randomBytes,
  createDecipheriv,
  createHash,
} from 'crypto';

@Injectable()
export class EncryptionService {
  private readonly algorithm: string;
  private readonly key: Buffer;
  constructor() {
    this.algorithm = 'aes-256-ctr';
    this.key = createHash('sha256')
      .update(String(process.env.ENCRYPTION_KEY))
      .digest()
      .subarray(0, 32);
  }
  async encrypt(data: string): Promise<string> {
    const iv = randomBytes(16);
    const cipher = createCipheriv(this.algorithm, this.key, iv);
    const result = Buffer.concat([iv, cipher.update(data), cipher.final()]);
    return result.toString('hex');
  }

  async decrypt(encryptedData: string): Promise<string> {
    const data = Buffer.from(encryptedData, 'hex');
    const iv = data.subarray(0, 16);
    const encryptedText = data.subarray(16);
    const decipher = createDecipheriv(this.algorithm, this.key, iv);
    const decrypted = Buffer.concat([
      decipher.update(encryptedText),
      decipher.final(),
    ]);
    return decrypted.toString('utf8');
  }
}
