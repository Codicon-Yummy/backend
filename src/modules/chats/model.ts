import * as mongoose from 'mongoose';

export interface IChat extends mongoose.Document {
  number: number;
  password: string;
  role?: string;
}

const ChatSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    role: { type: String, default: 'user' },
  },
  {
    versionKey: false,
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  },
);

const User = mongoose.model<IChat>('Chat', ChatSchema);

export default User;
