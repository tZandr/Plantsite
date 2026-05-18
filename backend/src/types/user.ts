import mongoose from 'mongoose';

export interface IUser {
  username: string;
  email: string;
}

export type User = {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  createdAt: string;
};

export type LoginData = {
  email: string;
  password: string;
};

export default mongoose.model('User');
