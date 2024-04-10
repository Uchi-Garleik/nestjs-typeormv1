import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export class BucketService {
  private s3;

  constructor() {
    console.log(process.env.AWS_ACCESS_KEY_ID);
    console.log(process.env.AWS_SECRET_ACCESS_KEY);
    console.log(process.env.AWS_REGION);
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
  }

  async listAllObjects(bucket: string, prefix = '') {
    const allObjects = [];
    let isTruncated = true;
    let marker;

    while(isTruncated) {
      const params = { Bucket: bucket, Prefix: prefix, Marker: marker };
      const response = await this.s3.listObjects(params).promise();

      response.Contents.forEach(item => {
        console.log(item);
        const url = `https://dd9iusbhd6tn4.cloudfront.net/${item.Key}`;
        // const url = `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${item.Key}`;
        allObjects.push(url);
      });

      isTruncated = response.IsTruncated;
      if(isTruncated) {
        marker = allObjects[allObjects.length - 1];
      }
    }
    return allObjects;
  }

}

