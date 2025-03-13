import User, { IUser } from '@models/user.model';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { JWT_EXPIRES, JWT_SECRET } from '@config/env';
import jwt from 'jsonwebtoken';

// export const signUp = async (req:any, res:any , next:any)=>{
//   const session = await mongoose.startSession();
//
//   try{
//
//     const {email,password}=req.body;
//     const existingUser=await User.findOne({email});
//     if(existingUser){
//       const error=new Error('User already exists');
//       res.status(409);
//       throw error;
//     }
//
//     session.startTransaction();
//     const salt=await bcrypt.genSalt(10);
//     const hashedPassword=await bcrypt.hash(password,salt);
//
//     const newUsers=await User.create([{email,password: hashedPassword}], {session});
//
//
//     if (!JWT_SECRET) {
//       throw new Error("JWT_SECRET is not defined");
//     }
//
//     const token:string = jwt.sign( { userId: newUsers[0]._id }, JWT_SECRET, { expiresIn: String(JWT_EXPIRES) } );
//
//
//     await session.commitTransaction();
//     await session.endSession();
//
//     res.status(201).json({
//       success: true,
//       message: 'User created successfully',
//       data:{
//         token,
//         user: newUsers[0]
//       }
//     })
//
//   }catch(error){
//     await session.abortTransaction();
//     await session.endSession();
//     next(error);
//   }
// }

export const signUp = async (req: any, res: any, next: any) => {
  const session = await mongoose.startSession();

  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error('User already exists');
      res.status(409);
      throw error;
    }

    session.startTransaction();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUsers = await User.create([{ email, password: hashedPassword }], { session });

    console.log(JWT_SECRET)

    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }

    // Ensure user ID is valid

    if (!newUsers[0]?._id) {
      throw new Error("User ID is missing or invalid");
    }

    // Sign the token

    const token = jwt.sign(String(newUsers[0]._id) , String(JWT_SECRET), { expiresIn: String(JWT_EXPIRES) });

    // Log the token and payload for debugging
    console.log("Generated Token:", token);
    console.log("Payload:", { userId: newUsers[0]._id });

    await session.commitTransaction();
    await session.endSession();

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        token,
        user: newUsers[0]
      }
    });
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    next(error);
  }
};

export const signIn=async(req: any, res: any, next: (arg0: unknown) => void)=>{
  try{

  }catch(error){
    next(error);
  }
}

export const signOut=async(req: any, res: any, next: (arg0: unknown) => void)=>{
  try{

  }catch(error){
    next(error);
  }
}