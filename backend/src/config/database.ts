import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI

export const ConnectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI as string);
        console.log('MongoDB Connected Successfully');
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
}