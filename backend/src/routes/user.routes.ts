import express from 'express';
import { getAllUsers, createUser } from '@controllers/user.controller';

const userRouter = express.Router();

userRouter.get('/user-info/:id', (req,res)=>{
    res.send("User info");
});
userRouter.post('/create-user/', createUser);
// userRouter.put('/update-user/:id', updateUser);

export default userRouter;
