import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import type { JwtPayload } from 'jsonwebtoken';
import { loginUser } from '../services/auth.services';
import UserModel from '../models/user';

export const loginUserController = async (req: Request, res: Response) => {
  try {
    const { accessToken, refreshToken } = await loginUser(req.body);

    // REMEMBER TO CHANGE TO SECURE AND SAMESITE NONE
    // Right now its just a cookie for development
    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({ accessToken });
  } catch (error) {
    res.status(401).json({ message: error });
  }
};

export const refreshTokenController = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies?.jwt;
    if (!refreshToken) return res.status(401).json({ message: 'No refresh token' });

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!
    ) as JwtPayload;

    const user = await UserModel.findById(decoded.sub);
    if (!user) return res.status(401).json({ message: 'User not found' });

    const accessToken = jwt.sign(
      { sub: user._id, username: user.username },
      process.env.JWT_SECRET!,
      { expiresIn: '15min' }
    );

    res.status(200).json({ accessToken });
  } catch (error) {
    res.status(403).json('Invalid or expired refresh token');
  }
};


export const logoutUserController = async (req: Request, res: Response) => {
  res.clearCookie('jwt', { httpOnly: true, sameSite: 'lax', secure: false });
  res.status(200).json({ message: 'Logged out' });
};

export const getMe = async (req: Request, res: Response) => {
  try {
    if (!req.user) throw new Error('user not defined');
    const myId = (req.user as JwtPayload).sub;
    const user = await UserModel.findById(myId).select('-passwordHash -__v -updatedAt');
    res.status(200).json({ user });
  } catch (error) {
    res.status(401).json({ message: error });
  }
};
