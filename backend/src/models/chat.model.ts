import mongoose, { Schema, Document } from 'mongoose';

  export interface IMessage {
    role: string;
    content: {
      type: string;
      text: string;
    } | string;
  }

  type IMessageT = Array<IMessage>;

  export interface IChat extends Document {
    userId: string;
    messages: Array<IMessage>;
  }

  const ChatSchema = new Schema<IChat>(
    {
      userId: { type: String, required: [true, 'userId is required'] },
      messages: {
        type: [{
          role: String,
          content: Schema.Types.Mixed  // This allows both string and object content
        }],
        required: true
      },
    },
  );

  const ChatModel = mongoose.model<IChat>('Chat', ChatSchema);

  export default ChatModel;