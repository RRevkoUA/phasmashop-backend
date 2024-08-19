import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';

type ValidFileExtensions = 'jpg' | 'jpeg' | 'png' | 'gif';
type ValidFileTypes = 'image';

const ValidFileExtensions: ValidFileExtensions[] = [
  'jpg',
  'jpeg',
  'png',
  'gif',
];
const ValidFileTypes: ValidFileTypes[] = ['image'];

export const imageStorage = {
  storage: diskStorage({
    destination: `${process.cwd}}/images`,
    filename: (req, file, cb) => {
      console.log('process.cwd(): ', process.cwd());
      const extension = file.originalname.split('.').pop();
      const filename = `${uuidv4()}.${extension}`;
      cb(null, filename);
    },
  }),
};
