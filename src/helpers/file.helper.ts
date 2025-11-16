import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import { InstagramPostData } from 'src/config/interfaces';

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

async  generateInstagramPost(
  topic: string,
  imagePrompt: string
): Promise<InstagramPostData> {
  try {
    // 1. Generate caption using Pollinations Text API
    const captionPrompt = `Write an engaging Instagram caption about ${topic}. 
    Make it catchy, authentic, and 2-3 sentences long. 
    Don't include hashtags in the caption.`;
    
    const captionResponse = await axios.post(
      'https://text.pollinations.ai/',
      {
        messages: [
          {
            role: 'user',
            content: captionPrompt
          }
        ],
        model: 'openai'
      }
    );
    
    const caption = captionResponse.data.trim();

    // 2. Generate hashtags
    const hashtagPrompt = `Generate 15-20 relevant Instagram hashtags for a post about ${topic}. 
    Return only hashtags separated by spaces, no numbering or extra text.
    Mix popular and niche hashtags.`;
    
    const hashtagResponse = await axios.post(
      'https://text.pollinations.ai/',
      {
        messages: [
          {
            role: 'user',
            content: hashtagPrompt
          }
        ],
        model: 'openai'
      }
    );
    
    const hashtagText = hashtagResponse.data.trim();
    const hashtags = hashtagText
      .split(/\s+/)
      .filter(tag => tag.startsWith('#'))
      .map(tag => tag.replace(/[^a-zA-Z0-9#_]/g, ''))
      .slice(0, 20);

    // 4. Combine caption with hashtags
    const fullCaption = `${caption}

.
.
.
${hashtags.join(' ')}`;

    return {
      caption,
      hashtags,
      fullCaption
    };

  } catch (error) {
    console.error('Error generating Instagram post:', error);
    throw error;
  }
}

}
