import { JWT_SECRET, OPENROUTER_KEY, OPENROUTER_MODEL } from '@config/env';
import ChatModel, { IChat, IMessage } from '@models/chat.model';
import { Response, Request } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

export const chatFunc = async (req:Request, res:Response) => {
  const session = await mongoose.startSession();

  try {

    let chat;

    const { newMessage, userId, _id }=req.body;

    console.log('newMessage', newMessage, 'userId', userId, 'id', _id);

    session.startTransaction();

    if(!_id){
      const newChat = new ChatModel({
        userId,
        messages: []
      });
      chat = await ChatModel.create(newChat);
    }else{
      chat = await ChatModel.findOne({ _id });
    }



    if(!chat){
      return res.status(404).json({message: 'No chat found'});
    }

    console.log('chat', chat);

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: `${OPENROUTER_MODEL}`,
        messages: [...chat.messages, newMessage]
      })
    });

    // const contentType = response.headers.get('Content-Type');
    // if (!contentType || !contentType.includes('application/json')) {
    //   const textResponse = await response.text();
    //   throw new Error(`Unexpected response format: ${textResponse}`);
    // }

    console.log('rcv response');
    const data = await response.json();

    if (!data.choices || data.choices.length === 0) {
      console.log('no choices found');
      throw new Error('Unexpected API response format');
    }

    console.log(data);

    const botResponse: any = {
      role: 'assistant',
      content: { type: 'text', text: String(data?.choices[0]?.message.content) }
    };

    console.log('botResponse', botResponse);

    const updatedChat:IChat[] = [...chat.messages, newMessage, botResponse];

    console.log('updatedChat', updatedChat);

    const updatedChatDoc = await ChatModel.findOneAndUpdate({ _id }, { messages: updatedChat }, { new: true });

    if(!updatedChatDoc){
      return res.status(404).json({message: 'No chat found'});
    }


    await session.commitTransaction();
    await session.endSession();
    res.status(200).json(updatedChat);

}catch (error) {

    await session.commitTransaction();
    await session.endSession();
    res.status(500).json({ message: 'Error creating chat', error });
  }
}

export const getChatList = async (req:Request, res:Response) => {
  try {
    const userId = req.params.id;

    const chats = await ChatModel.find({ userId });
    const chatList = chats.map(chat => {
      chat.id,
      chat.messages[0]
    });
    res.status(200).json(chatList);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching chats', error });
  }
}