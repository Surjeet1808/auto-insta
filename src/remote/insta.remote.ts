import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class InstaRemote {
  private readonly logger = new Logger(InstaRemote.name);

async  postCarouselToInstagram(
  imageUrls: string[], 
  caption: string
) {
  try {
    // Step 1: Create containers for each image
    const containerIds = [];
    
    for (const imageUrl of imageUrls) {

      const response = await axios.post(
        `https://graph.facebook.com/v21.0/${process.env.INSTAGRAM_ACCOUNT_ID}/media`,
        {
          image_url: imageUrl,
          is_carousel_item: true, // Important for carousel
          access_token: process.env.PAGE_ACCESS_TOKEN
        }
      );
      containerIds.push(response.data.id);
    }
    
    // Step 2: Create carousel container
    const carouselResponse = await axios.post(
      `https://graph.facebook.com/v21.0/${process.env.INSTAGRAM_ACCOUNT_ID}/media`,
      {
        media_type: 'CAROUSEL',
        children: containerIds.join(','),
        caption: caption,
        access_token: process.env.PAGE_ACCESS_TOKEN
      }
    );
    
    const carouselId = carouselResponse.data.id;
    
    // Step 3: Publish the carousel
    const publishResponse = await axios.post(
      `https://graph.facebook.com/v21.0/${process.env.INSTAGRAM_ACCOUNT_ID}/media_publish`,
      {
        creation_id: carouselId,
        access_token: process.env.PAGE_ACCESS_TOKEN
      }
    );
    
    console.log('Carousel published! ID:', publishResponse.data.id);
    return publishResponse.data;
  } catch (error) {
    console.error('Error posting carousel:', error.response?.data || error);
    throw error;
  }
}
}
