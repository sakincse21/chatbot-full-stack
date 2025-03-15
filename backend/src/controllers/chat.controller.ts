import { JWT_SECRET, OPENROUTER_KEY, OPENROUTER_MODEL } from '@config/env';
import ChatModel, { IChat } from '@models/chat.model';
import { Response, Request } from 'express';
import jwt from 'jsonwebtoken';

export const chatFunc = async (req:Request, res:Response) => {
  try {

    let chat;

    const { newMessage, userId, id }=req.body;

    if(!id){
      const newChat = new ChatModel({
        userId,
        messages: [newMessage]
      });
      chat = await ChatModel.create(newChat);
    }

    chat = await ChatModel.findOne({ id });

    if(!chat){
      return res.status(404).json({message: 'No chat found'});
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: `${OPENROUTER_MODEL}`,
        messages: [...chat.messages, newMessage].map(msg => ({
          role: msg.role,
          content: msg.content.text
        }))
      })
    });

    const contentType = response.headers.get('Content-Type');
    if (!contentType || !contentType.includes('application/json')) {
      const textResponse = await response.text();
      throw new Error(`Unexpected response format: ${textResponse}`);
    }

    const data = await response.json();

    if (!data.choices || data.choices.length === 0) {
      throw new Error('Unexpected API response format');
    }

    // const botResponse: IMessage = {
    //   role: 'bot',
    //   content: { type: 'text', text: data.choices[0].message.content }
    // };
}catch (error) {
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