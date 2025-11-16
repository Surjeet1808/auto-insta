// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { join } from 'path';
import * as dotenv from 'dotenv'; // Change this line
import { APP_PORT } from './config/constants';

async function bootstrap() {
  dotenv.config(); // Now it will work
  
  const app = await NestFactory.create(AppModule);

  app.use(
    '/instagram',
    express.static(join(process.cwd(), 'public', 'instagram'))
  );

  await app.listen(APP_PORT);
  console.log(`Server running on http://localhost:${APP_PORT}`);
}

bootstrap();