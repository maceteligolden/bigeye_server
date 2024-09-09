import { injectable } from "tsyringe";
import { S3Client, paginateListObjectsV2 } from "@aws-sdk/client-s3";

@injectable()
export default class AWSS3 {
  s3Client: S3Client;
  constructor() {
    this.s3Client = new S3Client({ region: `${process.env.AWS_S3_CODE_REGION}` });
  }

  async getFilteredObjects(filter: string): Promise<string[]> {
    const filteredObjects: string[] = [];

    const paginator = paginateListObjectsV2({ client: this.s3Client }, { Bucket: "istestknowledge" });

    for await (const page of paginator) {
      const contents = page.Contents;
      if (contents) {
        for (const object of contents) {
          if (object.Key && this.isCodeRelated(object.Key, filter)) {
            filteredObjects.push(object.Key);
          }
        }
      }
    }

    return filteredObjects;
  }

  private isCodeRelated(key: string, filter: string): boolean {
    const lowerCaseKey = key.toLowerCase();
    return lowerCaseKey.includes(filter.toLowerCase());
  }
}
