// src/app.controller.ts
import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  root() {
    return { 
      status: 'success',
      message: 'Server is running'
    };
  }
}