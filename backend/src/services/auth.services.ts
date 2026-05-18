import bcrypt from 'bcrypt';
import type { LoginData } from '../types/user';
import UserModel from '../models/user';
import jwt from 'jsonwebtoken';

export const loginUser = async (loginData: LoginData) => {
  const { email, password } = loginData;

  const user = await UserModel.findOne({ email }).select('+passwordHash');
  if (!user) throw new Error('Invalid credentials');

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) throw new Error('Invalid Credentials');

  return {
    accessToken: jwt.sign(
      {
        sub: user._id, username: user.username
      },
      process.env.JWT_SECRET as string,
      { expiresIn: '15m' }
    ),
    refreshToken: jwt.sign(
      {
        sub: user._id, username: user.username
      },
      process.env.JWT_REFRESH_SECRET as string,
      { expiresIn: '30d' }
    )
  };
};
