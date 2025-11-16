import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import JSZip = require('jszip');    // <-- FIXED
import { HelloService } from './post.service';

@Controller('api')
export class HelloController {
  constructor(private readonly helloService: HelloService) {}

@Get('images')
async downloadImages(@Query('topic') topic: string, @Res() res: Response) {
  try {
    if (!topic) {
      return res.status(400).json({
        status: 'error',
        message: 'Topic is required'
      });
    }

    const images = await this.helloService.consume(topic);
    
    return res.json({
      status: 'success',
      images: images
    });
    
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
      error: error
    });
  }
}

}