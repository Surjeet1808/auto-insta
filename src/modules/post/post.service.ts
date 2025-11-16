import { Injectable, Logger } from '@nestjs/common';
import { AiRemote } from '../../remote/ai.remote';
import { Helpers } from '../../helpers/file.helper';
import { InstaRemote } from '../../remote/insta.remote';


@Injectable()
export class HelloService {
    constructor(
        private readonly aiRemote: AiRemote,
        private readonly helpers: Helpers,
        private readonly instaRemote: InstaRemote
    ) {}
  private readonly logger = new Logger(HelloService.name);

  async consume(topic:string): Promise<any> {
    let res:any[]
    try {
       res = await this.aiRemote.getText(topic);
       
    } catch (err) {
      this.logger.error('Error calling external taxt API', err as any);
      throw err;
    }

    const images = [];

  for (const t of res) {
    try{
    const  url = await this.aiRemote.getImage(t);
    //const url = await this.helpers.saveImageLocally(buffer, contentType);
    images.push(url);
     } catch (err) {
      this.logger.error('Error calling external image API', err as any);
    }
  } 

  const postData = await this.helpers.generateInstagramPost(
  topic,
  res.join(",")
);


  try{
    const res = this.instaRemote.postCarouselToInstagram(
      images,
      postData.fullCaption
    );
    return res;
  } catch(err){
    this.logger.error('Error posting to Instagram', err as any);
  } 
  finally{
      for (const img of images) {
      this.helpers.deleteLocalFile(img.filePath)
  }
  }

  return images;
  }
}
