import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { ImageInterceptorEnum } from '../enums';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageHelper } from '../helpers/image.helper';

export function ImageInterceptor(imageType: ImageInterceptorEnum) {
  return applyDecorators(
    UseInterceptors(FileInterceptor('file', imageHelper[imageType])),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    }),
  );
}
