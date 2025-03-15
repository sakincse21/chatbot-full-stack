import User from '@models/user.model';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { JWT_EXPIRE, JWT_SECRET } from '@config/env';
import jwt from 'jsonwebtoken';
import { NextFunction } from 'express';
import * as process from 'node:process';

export const signUp = async (req:any, res:any, next:NextFunction)=>{
  const session = await mongoose.startSession();

  try{

    const {email,password}=req.body;

    if(!email || !password){
      const error=new Error('Please provide email and password');
      res.status(400);
      throw error
    }

    const existingUser=await User.findOne({email});
    if(existingUser){
      const error=new Error('User already exists');
      res.status(409);
      throw error;
    }


    session.startTransaction();

    const salt:string=await bcrypt.genSalt(10);
    const hashedPassword:string=await bcrypt.hash(String(password), salt);

    const newUsers=await User.create([{email,password: hashedPassword}], {session});


    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }

    const token:string = jwt.sign( { userId: newUsers[0]._id }, JWT_SECRET, { expiresIn: JWT_EXPIRE } );


    await session.commitTransaction();
    await session.endSession();

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data:{
        token,
        user: newUsers[0]
      }
    })

  }catch(error){
    await session.abortTransaction();
    await session.endSession();
    next(error);
  }
}

export const signIn=async(req: any, res: any, next: NextFunction)=>{
  try{
    const {email,password}=req.body;

    if(!email || !password){
      const error=new Error('Please provide email and password');
      res.status(400);
      throw error;
    }


    const user=await User.findOne({email});
    if(!user){
      const error=new Error('User not found');
      res.status(404);
      throw error;
    }
    const isValidPassword=await bcrypt.compare(password, user.password);
    if(!isValidPassword){
      const error=new Error('Invalid password');
      res.status(401);
      throw error;
    }

    if(!JWT_SECRET){
      throw new Error('JWT_SECRET is not defined');
    }
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRE });

    res.status(200).json({
      success: true,
      message: 'User signed in successfully',
      data: {
        token,
        user
    }});

  }catch(error){
    next(error);
  }
}

export const signOut=async(req: any, res: any, next: NextFunction)=>{
  try{

  }catch(error){
    next(error);
  }
}