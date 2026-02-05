import AWS from 'aws-sdk'
import { config } from './env.js'

let s3: AWS.S3 | null = null

export const getS3Client = (): AWS.S3 | null => {
  if (s3) {
    return s3
  }

  if (config.AWS_ACCESS_KEY_ID && config.AWS_SECRET_ACCESS_KEY) {
    s3 = new AWS.S3({
      accessKeyId: config.AWS_ACCESS_KEY_ID,
      secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
      region: config.AWS_REGION,
    })
    return s3
  }

  return null
}

export const uploadToS3 = async (
  file: Buffer,
  fileName: string,
  contentType: string
): Promise<string> => {
  const s3Client = getS3Client()
  if (!s3Client || !config.AWS_S3_BUCKET_NAME) {
    throw new Error('S3 configuration is missing')
  }

  const params: AWS.S3.PutObjectRequest = {
    Bucket: config.AWS_S3_BUCKET_NAME,
    Key: fileName,
    Body: file,
    ContentType: contentType,
    ACL: 'public-read', // Adjust based on your needs
  }

  const result = await s3Client.upload(params).promise()
  return result.Location
}

