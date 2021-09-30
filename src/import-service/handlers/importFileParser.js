import { S3, SQS } from 'aws-sdk';
import * as csv from 'csv-parser';

const { REGION, SQS_URL } = process.env;

export const handler = async (event, _context) => {
  for (const record of event?.Records) {
    const {
      s3: { bucket, object }
    } = record;
    try {
      await runOperation(bucket, object);
    } catch (err) {
      console.log('Error occurred:', err);
      return {
        statusCode: 500
      };
    }
    return {
      statusCode: 202
    };
  }
};

async function runOperation(bucket, object) {
  const s3 = new S3({ region: REGION, signatureVersion: 'v4' });
  const sqs = new SQS();
  const params = {
    Bucket: bucket.name,
    Key: object.key
  };

  await new Promise((resolve, reject) => {
    s3.getObject(params)
      .createReadStream()
      .pipe(csv())
      .on('data', async (data) => {
        try {
          await sqs.sendMessage(message(data)).promise();
          console.log(`Data was sent: ${JSON.stringify(data)}`);
        } catch (err) {
          console.error(JSON.stringify(err.message));
        }
      })
      .on('error', (error) => {
        console.error(error);
        reject();
      })
      .on('end', async () => {
        const source = `${bucket.name}/${object.key}`;
        console.log(`Copy from ${source}`);
        await s3
          .copyObject({
            Bucket: bucket.name,
            CopySource: source,
            Key: object.key.replace('uploaded', 'parsed')
          })
          .promise();
        console.log(`Copied into ${source.replace('uploaded', 'parsed')}`);
        await s3
          .deleteObject({
            Bucket: bucket.name,
            Key: object.key
          })
          .promise();
        console.log(`${source} is deleted`);
        resolve();
      });
  });
}
const message = (data) => ({
  QueueUrl: SQS_URL,
  MessageBody: JSON.stringify(data)
});
