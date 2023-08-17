/**
 * Mongoose schema for the User model.
 * This schema defines the structure of the User document in the MongoDB database.
 * Each property in the schema corresponds to a field in the database document.
 *
 * - `name`: Represents the name of the user.
 * - `email`: Represents the email address of the user. It's unique for each user.
 * - `password`: Represents the password of the user. It should be stored securely.
 */
import { Schema, Document, model } from 'mongoose';

export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
}

export const UserSchema = new Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});

export const UserModel = model<UserDocument>('User', UserSchema);
