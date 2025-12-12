import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class InstaRemote {
  private readonly logger = new Logger(InstaRemote.name);

async postCarouselToInstagram(
  imageUrls: string[], 
  caption: string
) {
  try {
    // Validate caption length (Instagram limit is 2200 characters)
    if (caption.length > 2200) {
      console.warn('⚠️ Caption exceeds 2200 characters, truncating...');
      caption = caption.substring(0, 2197) + '...';
    }

    // Step 1: Create containers for each image
    const containerIds = [];
    
    for (const imageUrl of imageUrls) {
      const response = await axios.post(
        `https://graph.facebook.com/v21.0/${process.env.INSTAGRAM_ACCOUNT_ID}/media`,
        null,
        {
          params: {
            image_url: imageUrl,
            is_carousel_item: true,
            access_token: process.env.PAGE_ACCESS_TOKEN
          }
        }
      );
      console.log('Container created:', response.data.id);

      containerIds.push(response.data.id);
      
      // 2. Add a fixed 10-second delay
      console.log("Waiting 10 seconds before next upload...");
      await new Promise((resolve) => setTimeout(resolve, 10000));

    }

    // Step 2: Wait for all media items to be processed
    console.log('⏳ Waiting for media items to be processed...');
    
    // for (const cid of containerIds) {
    //   await this.waitForMediaStatus(cid);
    // }
    
    // Step 3: Create carousel container
    console.log('📦 Creating carousel container...');
    
    const params = new URLSearchParams();
    params.append('media_type', 'CAROUSEL');
    params.append('children', containerIds.join(','));
    if (caption) {
      params.append('caption', caption);
    }
    params.append('access_token', process.env.PAGE_ACCESS_TOKEN!);
    
    const carouselResponse = await axios.post(
      `https://graph.facebook.com/v21.0/${process.env.INSTAGRAM_ACCOUNT_ID}/media`,
      params.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    
    const carouselId = carouselResponse.data.id;
    console.log('✅ Carousel container created:', carouselId);
     // 2. Add a fixed 10-second delay
      console.log("Waiting 10 seconds before publish...");
      await new Promise((resolve) => setTimeout(resolve, 10000));
    
    // Verify carousel ID is valid
    if (!carouselId || carouselId === '0') {
      console.error('❌ Invalid carousel ID received:', carouselResponse.data);
      throw new Error('Failed to create carousel container - received invalid ID');
    }
    
    // Step 4: Wait for the CAROUSEL CONTAINER to be ready ⭐ THIS IS THE KEY FIX
    // console.log('⏳ Waiting for carousel container to be processed...');
    // await this.waitForMediaStatus(carouselId);
    
    // Step 5: Publish the carousel
    console.log('📤 Publishing carousel...');
    const publishParams = new URLSearchParams();
    publishParams.append('creation_id', carouselId);
    publishParams.append('access_token', process.env.PAGE_ACCESS_TOKEN!);
    
    const publishResponse = await axios.post(
      `https://graph.facebook.com/v21.0/${process.env.INSTAGRAM_ACCOUNT_ID}/media_publish`,
      publishParams.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    
    console.log('🎉 Carousel published successfully! ID:', publishResponse.data.id);
    console.log('🔗 View on Instagram: https://www.instagram.com/p/' + publishResponse.data.id);
    return publishResponse.data;
    
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('❌ Error posting carousel:');
      console.error('Status:', error.response?.status);
      console.error('Data:', JSON.stringify(error.response?.data, null, 2));
    } else {
      console.error('❌ Error posting carousel:', error);
    }
    throw error;
  }
}

// Helper method to wait for media status
private async waitForMediaStatus(mediaId: string, maxRetries: number = 15): Promise<void> {
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      const response = await axios.get(
        `https://graph.facebook.com/v21.0/${mediaId}`,
        {
          params: {
            fields: 'id,status_code',
            access_token: process.env.PAGE_ACCESS_TOKEN
          }
        }
      );
      
      console.log(`  Status (${mediaId}): ${response.data.status_code}`);
      
      if (response.data.status_code === "FINISHED") {
        console.log(`  ✅ Media ${mediaId} is ready.`);
        return;
      } else if (response.data.status_code === "ERROR") {
        throw new Error(`Media container ${mediaId} failed to process`);
      } else {
        console.log(`  ⏳ Still processing (${response.data.status_code})...`);
        await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 seconds
        retries++;
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        // Container might not exist yet, wait and retry
        console.log(`  ⏳ Container not ready yet, waiting...`);
        await new Promise(resolve => setTimeout(resolve, 3000));
        retries++;
      } else {
        throw error;
      }
    }
  }
  
  throw new Error(`Media container ${mediaId} timed out after ${maxRetries} attempts`);
}
}
