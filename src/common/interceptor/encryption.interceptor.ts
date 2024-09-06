import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { EncryptionService } from '../../encryption/encryption.service';

@Injectable()
export class EncryptionInterceptor implements NestInterceptor {
  constructor() {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const encryptionService = new EncryptionService();
    const res = context.switchToHttp().getResponse();
    if (!res) {
      Logger.error('Response object not found');
    }

    return next.handle().pipe(
      map(async (data) => {
        try {
          const encryptedText =
            typeof data === 'object' ? JSON.stringify(data) : data;
          return await encryptionService.encrypt(encryptedText);
        } catch (error) {
          console.error(error);
          res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ error: error.message });
          return throwError(() => new Error(error.message));
        }
      }),
      catchError((error) => throwError(() => new Error(error))),
    );
  }
}
