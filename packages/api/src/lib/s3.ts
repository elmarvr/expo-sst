import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Resource } from "sst";
import { fileTypeFromBuffer } from "file-type";

export const s3 = new S3Client({});

export async function uploadImage(body: Buffer) {
  const key = crypto.randomUUID();

  const contentType = await fileTypeFromBuffer(body);

  if (!contentType) {
    throw new Error("Invalid file type");
  }

  const command = new PutObjectCommand({
    Bucket: Resource.Bucket.name,
    Key: key,
    Body: body,
    ContentType: contentType.mime,
  });

  await s3.send(command);

  return key;
}

export async function uploadImagefromUrl(url: string) {
  const response = await fetch(url);
  const body = await response.arrayBuffer();

  return uploadImage(Buffer.from(body));
}

export function getImageUrl(key: string) {
  return `https://${Resource.Bucket.name}.s3.amazonaws.com/${key}`;
}
