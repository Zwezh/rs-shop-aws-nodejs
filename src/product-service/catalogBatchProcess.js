import { SNS } from 'aws-sdk';
import { insertProduct } from './db-operations/insertProduct';

const { REGION, SNS_ARN } = process.env;

export const handler = async (event) => {
  let message;
  try {
    const result = await Promise.all(
      event.Records.map(
        async ({ body }) => await insertProduct(JSON.parse(body))
      )
    );
    message = getMessage(result, 'Document import complete', 'success');
  } catch (err) {
    const reason = {
      error: err.message,
      records: event.Records
    };
    console.error(`Failed to create products ${JSON.stringify(reason)}`);
    console.error(err);
    message = getMessage(reason, 'Document import failed', 'fail');
  }
  await notifyInsertProductSNS(message);
};

const notifyInsertProductSNS = async (message) => {
  try {
    await new SNS({ region: REGION }).publish(message).promise();
  } catch (err) {
    console.error(`Failed to send an email message: ${err.message}`);
  }
};

const getMessage = (value, title, statusValue) => ({
  Subject: title,
  Message: JSON.stringify(value),
  TopicArn: SNS_ARN,
  MessageAttributes: {
    status: {
      DataType: 'String',
      StringValue: statusValue
    }
  }
});
