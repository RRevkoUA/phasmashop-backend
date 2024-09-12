import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { EncryptionService } from '../../encryption/encryption.service';

@Injectable()
export class EncryptionInterceptor implements NestInterceptor {
  constructor() {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const encryptionService = new EncryptionService();
    const res = context.switchToHttp().getResponse();
    const req = context.switchToHttp().getRequest();
    if (!res) {
      Logger.error('Response object not found');
    }

    Logger.debug(EncryptionInterceptor.name, req.body);
    if (req.headers['x-swagger-request'] === 'true') {
      Logger.debug('Swagger request - skipping encryption');
      return next.handle();
    }

    return next.handle().pipe(
      map(async (data) => {
        try {
          const encryptedText =
            typeof data === 'object' ? JSON.stringify(data) : data;
          return await encryptionService.encrypt(encryptedText);
        } catch (error) {
          Logger.error(error);
          res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ error: error.message });
          return throwError(() => new Error(error.message));
        }
      }),
    );
  }
}
