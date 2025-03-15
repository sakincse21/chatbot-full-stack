import dotenv from 'dotenv';

dotenv.config();

export const MONGO_URI = process.env.MONGO_URI;
export const JWT_EXPIRE= '30d';
export const JWT_SECRET = process.env.JWT_SECRET;
export const PORT = process.env.PORT;
export const ARCJET_KEY = process.env.ARCJET_KEY;
export const ARCJET_ENV= process.env.ARCJET_ENV;
export const OPENROUTER_KEY = process.env.OPENROUTER_KEY;
export const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL;