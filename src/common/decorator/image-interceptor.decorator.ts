import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { ImageInterceptorEnum } from '../enums';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageHelper } from '../helpers/image.helper';

export function ImageInterceptor(imageType: ImageInterceptorEnum) {
  let decorators = applyDecorators(
    UseInterceptors(FileInterceptor('file', imageHelper[imageType])),
    ApiConsumes('multipart/form-data'),
  );

  switch (imageType) {
    case ImageInterceptorEnum.IMAGE_AVATAR:
      return (decorators = applyDecorators(
        decorators,
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
      ));
    case ImageInterceptorEnum.IMAGE_COMMENTARY:
    case ImageInterceptorEnum.IMAGE_PRODUCT:
      return (decorators = applyDecorators(
        decorators,
        // also add text field to the body request
        ApiBody({
          schema: {
            type: 'object',
            properties: {
              files: {
                type: 'array',
                items: {
                  type: 'string',
                  format: 'binary',
                },
              },
            },
          },
        }),
      ));
  }
}
