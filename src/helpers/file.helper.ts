import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class Helpers {
  private readonly logger = new Logger(Helpers.name);

  async saveImageLocally(buffer: Buffer, contentType: string) {
  const ext = contentType === 'image/png' ? 'png' : 'jpg';
  const fileName = `insta-${Date.now()}.${ext}`;

  const dirPath = path.join(process.cwd(), 'public', 'instagram');

  const filePath = path.join(dirPath, fileName);

  // 🔥 Ensure directory exists
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  // Save file
  fs.writeFileSync(filePath, buffer);

  // PUBLIC URL (based on your server)
  const publicUrl = `${process.env.BASE_URL}/instagram/${fileName}`;

  return { publicUrl, filePath };
}

deleteLocalFile(filePath: string) {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Deleted local file: ${filePath}`);
    }
  } catch (err) {
    console.error('Error deleting file:', err);
  }
}

}
