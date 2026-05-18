import bcrypt from 'bcrypt';
import type { User } from '../types/user';
import UserModel from '../models/user';

export const createUser = async (userData: User) => {
  if (!userData) throw new Error('Userdata is invalid');

  const { password, ...rest } = userData;
  const passwordHash = await bcrypt.hash(password, 15);

  const user = await UserModel.create({ ...rest, passwordHash });

  return await UserModel.findById(user._id).select('-passwordHash');
};

export const saveFavoriteArticle = async (articleId: number, userId: string) => {
  const user = await UserModel.findById(userId);
  if (!user) throw new Error('User was not found');

  if (user.favoriteArticles.includes(articleId)) throw new Error('This article has already been saved');

  user.favoriteArticles.push(articleId);
  await user.save();
};
