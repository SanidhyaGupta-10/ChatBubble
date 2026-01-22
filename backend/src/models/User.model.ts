import mongoose, { Schema, Document, mongo } from 'mongoose';

export interface IUser extends Document {
    clerkId: string;
    name: string;
    email: string;
    avatar?: string;
    createAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
    clerkId: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
    },
    avatar:{
        type: String,
        default: "",
    }
}, {
    timestamps: true,
});

const User = mongoose.model('User', UserSchema);

export default User;