import { Router } from 'express';
import { chatFunc, getChatList } from '@controllers/chat.controller';
import authorize from '../middlewares/auth.middleware';

const chatRouter= Router();

chatRouter.post('/chatfunc',authorize, chatFunc);
chatRouter.get('/getChatList/:id', authorize, getChatList);

export default chatRouter;