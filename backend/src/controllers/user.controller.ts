import { Request, Response } from 'express';
import User from '@models/user.model';

export const getAllUsers = async (req: Request, res: Response, next: any) => {
	try {
		const users = await User.find();
		res.status(200).json({success: true, data: users});
	} catch (error) {
		res.status(500).json({ message: 'Error fetching users', error });
		next(error);
	}
};

export const getUser = async (req: Request, res: Response, next: any) => {
	try {
		const user = await User.findById(req.params.id).select(('-password'));
		if(!user){
			const error = new Error('User not found');
			res.statusCode = 400;
			throw error;
		}

		res.status(200).json({success: true, data: user});
	} catch (error) {
		res.status(500).json({ message: 'Error fetching user', error });
		next(error);
	}
};

export const createUser = async (req: Request, res: Response) => {
	try {
		const { name, email, password } = req.body;
		const user = new User({ name, email, password });
		await user.save();
		res.status(201).json(user);
	} catch (error) {
		res.status(400).json({ message: 'Error creating user', error });
	}
};
