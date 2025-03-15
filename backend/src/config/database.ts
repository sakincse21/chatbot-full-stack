import mongoose from 'mongoose';
import { MONGO_URI } from '@config/env';

const connectDatabase = async (): Promise<void> => {
	try {

		const mongoUri = MONGO_URI;

		if (!mongoUri) {
			throw new Error(
				'MONGO_URI is missing in the environment variables',
			);
		}

		await mongoose.connect(mongoUri);

		console.log('MongoDB Connected');
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error('Database connection failed:', error.message);
		} else {
			console.error('Unknown error occurred during database connection');
		}
		process.exit(1);
	}
};

export default connectDatabase;
