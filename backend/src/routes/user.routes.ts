import express from 'express';
import { getAllUsers, createUser, getUser } from '@controllers/user.controller';
import authorize from '../middlewares/auth.middleware';

const userRouter = express.Router();

userRouter.get('/user-info/:id', (req,res)=>{
    res.send("User info");
});
userRouter.post('/create-user/', createUser);
// userRouter.put('/update-user/:id', updateUser);
userRouter.get('/:id', authorize, getUser);


export default userRouter;
