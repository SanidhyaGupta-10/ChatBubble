import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI

export const ConnectDB = async () => {
    try {
        if(!MONGODB_URI){
            throw new Error('MONGODB_URI environment variable is not defined')
        }
        await mongoose.connect(MONGODB_URI);
        console.log('MongoDB Connected Successfully');
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
}