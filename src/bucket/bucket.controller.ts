import { Controller, Get } from '@nestjs/common';
import { BucketService } from './bucket.service';

@Controller('bucket')
export class BucketController {
  constructor(private readonly s3Service: BucketService) {}

  @Get('')
  async listAllObjects() {
    const bucketName = 'app-s3-bucket-manelserna'; // replace with your bucket name
    const allObjects = await this.s3Service.listAllObjects(bucketName);
    return allObjects;
  }
}
