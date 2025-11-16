import { Module } from '@nestjs/common';
import { HelloController } from './modules/post/post.controller';
import { HelloService } from './modules/post/post.service';
import { AiRemote } from './remote/ai.remote';
import { Helpers } from './helpers/file.helper';
import { InstaRemote } from './remote/insta.remote';
import { AppController } from './modules/app/app.controller';

@Module({
  imports: [],
  controllers: [HelloController,AppController],
  providers: [HelloService, AiRemote, Helpers, InstaRemote],
})
export class AppModule {}
