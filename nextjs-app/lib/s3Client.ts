import { S3Client as S3ClientType } from "@aws-sdk/client-s3";

// Singleton S3 client
class S3Client{
    private static instance: S3ClientType | null = null;

    private constructor() { }

    public static async getInstance() {
        if (!S3Client.instance) {
            S3Client.instance = new S3ClientType({
                region: process.env.AWS_REGION,
                credentials: {
                    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
                    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
                }
            });
        }

        return S3Client.instance;
    }
}

export default S3Client;