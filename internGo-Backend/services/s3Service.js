import AWS from 'aws-sdk'

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_S3_REGION,
});

const bucketName=process.env.AWS_BUCKET_NAME;

export const uploadImageToS3 = async (image, userName) => {
    const buffer = Buffer.from(image.replace(/^data:.+;base64,/, ''), 'base64');
    const key=`/profile-pictures/${userName}/${userName}-profilePicture_${Date.now()}`;

    const params = {
        Bucket: bucketName,
        Key: key,
        Body: buffer,
        ContentType: 'image/jpeg',
    };

    try {
        const data = await s3.upload(params).promise();
        return key;
    } catch (error) {
        throw error;
    }
};


