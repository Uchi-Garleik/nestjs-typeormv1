import { Module } from '@nestjs/common';
import { BucketService } from './bucket.service';
import { BucketController } from './bucket.controller';

@Module({
  controllers: [BucketController],
  providers: [BucketService],
})
export class BucketModule {}
