import { diskStorage } from 'multer';
import { uploadImageSize, uploadImageType } from 'src/validators';
import { v4 as uuidv4 } from 'uuid';

export const imageHelper = {
  storage: diskStorage({
    destination: `${process.cwd()}/images`,
    filename: (req, file, cb) => {
      const extension = file.originalname.split('.').pop();
      const filename = `${uuidv4()}.${extension}`;
      cb(null, filename);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (uploadImageType(req, file, cb) && uploadImageSize(req, file, cb)) {
      cb(null, true);
    }
  },
};
