import { Request, Response } from 'express';
import * as mongoose from 'mongoose';
import { z } from 'zod';

import { removePasswordFromUser } from '../auth/routes';
import PasswordHasher from '../auth/service';
import User, { IUser } from './model';

export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
} as const;

const userSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  role: z.nativeEnum(USER_ROLES).default(USER_ROLES.USER),
});

export const createUser = async (req: Request, res: Response) => {
  const { email } = req.body as IUser;

  try {
    const findUser = await User.findOne({ email });
    if (findUser) {
      return res.status(400).json({ message: 'Este email ya existe' });
    }

    const validatedData = userSchema.parse(req.body);

    const hashedPassword = await PasswordHasher.hashPassword(validatedData.password);
    const newUser = await User.create({ ...validatedData, password: hashedPassword });

    res.status(201).json(removePasswordFromUser(newUser));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.message, errors: error.errors });
    }

    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const findUser = await User.findById(id);
    if (!findUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(findUser);
  } catch (e) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (e) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const findUser = await User.findById(id);
    if (!findUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const validatedData = userSchema.parse(req.body);

    // TODO: remove password from response
    const updatedUser = await User.findByIdAndUpdate(id, { ...validatedData }, { new: true });

    res.status(200).json(updatedUser);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.message, errors: error.errors });
    }

    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID' });
    }

    const deletedUser = await User.deleteOne({ _id: id });

    if (deletedUser.deletedCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(204).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};
