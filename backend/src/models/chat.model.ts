import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage{
  user: string;
  content: string;
}

export interface IChat extends Document {
  email: string;
  messages: Array<IMessage>;
}

const ChatSchema = new Schema<IChat>(
  {
    email: { type: String, required: [true, 'email is required'] },
    messages: { type: [{ user: String, content: String }], required: true },
  },
);

export default mongoose.model<IChat>('Chat', ChatSchema);
