import { Document } from 'mongoose';

export interface Player extends Document {
  readonly _id: string;

  phoneNumber: string;
  
  email: string;
  
  name: string;

  ranking: string;

  rankingPosition: number;

  urlPicture: string;

  category: string;
  
}