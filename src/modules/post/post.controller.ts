import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import JSZip = require('jszip');    // <-- FIXED
import { HelloService } from './post.service';

@Controller('api')
export class HelloController {
  constructor(private readonly helloService: HelloService) {}

@Get('images')
async downloadImages(@Query('topic') topic: string, @Res() res: Response) {
  const images = await this.helloService.consume(topic);
  return res.json({status:"success",images:images});
}

}