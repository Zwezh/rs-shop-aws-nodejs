import S3 from 'aws-sdk/clients/s3';

const { REGION, BUCKET = 'upload-cars'} = process.env;

export const handler = async (event) => {
  const fileName = event.queryStringParameters.name;
  if (!fileName) {
    return {
      statusCode: 400,
      body: { error: 'Bad Request: provide name as query string param' }
    };
  }
  const path = `uploaded/${fileName}`;
  const s3 = new S3({ region: REGION });
  const params = {
    Bucket: BUCKET,
    Key: path,
    Expires: 60,
    ContentType: 'text/csv'
  };

  return new Promise((resolve, reject) => {
    s3.getSignedUrl('putObject', params, (error, url) => {
      if (error) {
        return reject(error);
      }
      resolve({
        statusCode: 200,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: url
      });
    });
  });
};
