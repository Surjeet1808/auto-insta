import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import {PROMPT_FOR_5_FUNNY_JOKE_IMAGES, PROMPT_FOR_QUALITY_ADD_ON } from '../config/constants';

@Injectable()
export class AiRemote {
  private readonly logger = new Logger(AiRemote.name);
    
  async getText(topic:string): Promise<any> {
    try {
      // Use centralized constant for the external API URL
      const encodedPrompt = encodeURIComponent(PROMPT_FOR_5_FUNNY_JOKE_IMAGES.replace('[TOPIC]', topic));
      const url = `${process.env.EXTERNAL_AI_TEXT_GENERATION_API_URL}${encodedPrompt}`;
      console.log("text url:",url)
      const res = await axios.get(url);
      return res.data as any[];
    } catch (err) {
      this.logger.error('Error calling external API', err as any);
      throw err;
    }
  }

  async getImage(prompt:any): Promise<any> {
    try {
    const encodedPrompt = encodeURIComponent(JSON.stringify(prompt))+" "+encodeURIComponent(`${PROMPT_FOR_QUALITY_ADD_ON}`);
    const url = `${process.env.EXTERNAL_AI_IMAGE_GENERATION_API_URL}${encodedPrompt}`;
    console.log("img url:",url)
    const res = await axios.get(url, {
      responseType: 'arraybuffer'
    });
    return {
       url:url
    };
  } catch (err) {
    this.logger.error('Error calling external API', err);
    throw err;
  }
  }
}
