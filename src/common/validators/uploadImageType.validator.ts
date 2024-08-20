import { UnprocessableEntityException } from '@nestjs/common';

type ValidFileExtensions = 'jpg' | 'jpeg' | 'png';
type ValidMimeTypes = 'image/jpeg' | 'image/png';

const ValidFileExtensions: ValidFileExtensions[] = ['jpg', 'jpeg', 'png'];
const ValidMimeTypes: ValidMimeTypes[] = ['image/jpeg', 'image/png'];

export const uploadImageType = (req, file, cb) => {
  const allowedMimeType: ValidMimeTypes[] = ValidMimeTypes;

  return allowedMimeType.includes(file.mimetype)
    ? true
    : cb(new UnprocessableEntityException('Invalid file type'), false) && false;
};
