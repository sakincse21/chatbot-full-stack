import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
	email: string;
	password: string;
}

const UserSchema = new Schema<IUser>(
	{
		email: { type: String, required: [true, 'email is required'], unique: true, trim: true, lowercase:true, match: [/\S+@\S+\.\S+/, 'please fill a valid email address'] },
		password: { type: String, required: [true, 'password is requires'], minlength: [8, 'minimum length should be 8 characters']  },
	},
	{ timestamps: true },
);

const User = mongoose.model('User',UserSchema);

export default User;
