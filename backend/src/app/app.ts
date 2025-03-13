import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRouter from '@routes/user.routes';
import authRouter from '@routes/auth.routes';
import chatRouter from '@routes/chats.routes';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health Check
app.get('/health', (_req, res) => {
	res.json({ message: 'Server is running' });
});

// Routes

app.use('/api/v1/user', userRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/chats', chatRouter);

export default app;
