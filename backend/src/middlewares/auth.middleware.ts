import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '@config/env';
import User from '@models/user.model';

// Define custom request interface with user property
interface AuthRequest extends Request {
  user?: any; // You could use a more specific type if needed
}

const authorize = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let token;
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
            token = req.headers.authorization.split(' ')[1];
        }

        if(!token){
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const decoded = jwt.verify(token, String(JWT_SECRET)) as jwt.JwtPayload;

        const user = await User.findById(decoded.userId);

        (req as AuthRequest).user = user;

        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized', error });
    }
}

export default authorize;