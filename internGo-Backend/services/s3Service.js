import s3 from "../config/s3Config.js";
import dotenv from 'dotenv';

dotenv.config();

export const uploadImageToS3 = async (image, userName) => {
    try {
        const bucketName = process.env.AWS_BUCKET_NAME;
        const buffer = Buffer.from(image.replace(/^data:.+;base64,/, ''), 'base64');
        const key = `/profile-pictures/${userName}/${userName}-profilePicture_${Date.now()}`;

        const params = {
            Bucket: bucketName,
            Key: key,
            Body: buffer,
            ContentType: 'image/jpeg',
        };

        await s3.upload(params).promise();
        return key;
    } catch (error) {
        throw error;
    }
};


