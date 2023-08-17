import { Document, Schema, model } from 'mongoose';

export interface JwtKeyDocument extends Document {
  key: string;
  createdAt: Date;
  expiresAt: Date;
}

export const JwtKeySchema: Schema = new Schema({
  key: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

export const JwtKeyModel = model<JwtKeyDocument>('JwtKey', JwtKeySchema);
