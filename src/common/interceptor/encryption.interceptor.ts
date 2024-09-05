import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { EncryptionService } from '../../encryption/encryption.service';

@Injectable()
export class EncryptionInterceptor implements NestInterceptor {
  encryptionService = new EncryptionService();
  constructor() {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const res = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map(async (data) => {
        let encryptedText = data;
        try {
          if (data instanceof Object) {
            encryptedText = JSON.stringify(data);
          }
          data = await this.encryptionService.encrypt(encryptedText);
        } catch (error) {
          console.error(error);
          res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ error: error.message });
          return throwError(() => new Error(error.message));
        }
        console.log(data);
        return data;
      }),
      catchError((error) => {
        return throwError(() => new Error(error));
      }),
    );
  }
}
