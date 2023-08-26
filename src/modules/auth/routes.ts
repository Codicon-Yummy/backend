import { Request, Response, Router } from 'express';

import { BadRequest } from '../../http/HttpHandler';
import { createUser } from '../users/controller';
import User, { IAuthLogin, IUser } from '../users/model';
import PasswordHasher from './../auth/service';
import { LoginController } from './controller';

const router = Router();
const controller = new LoginController();

router.post('/login', async (req: Request<void, void, IAuthLogin>, res: Response) => {
  try {
    const entity = controller.handlePost(req.body);
    const { email, password } = entity;

    if (!email && !password) {
      return res.status(400).json({
        success: false,
        message: 'Credenciales inválidas',
      });
    }

    const user = (await User.findOne({
      email,
    })) as IUser;

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Credenciales inválidas',
      });
    }

    const isMatch = await PasswordHasher.comparePasswords(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Credenciales inválidas',
      });
    }

    const token = PasswordHasher.generateJWT(user._id, user.role);

    res.status(200).json({
      success: true,
      token,
      user: removePasswordFromUser(user),
    });
  } catch (error: unknown) {
    if (error instanceof BadRequest) {
      res.status(error.code).json({
        success: false,
        message: error.message,
      });
    } else if (error instanceof Error) {
      res.status(500).json({ success: false, message: error.message });
    } else {
      res.status(500).json({ success: false, message: 'Unknown error' });
    }
  }
});

router.post('/register', createUser);

export const removePasswordFromUser = (user: IUser) => {
  const { password, ...rest } = user.toObject();
  return rest;
};

export default router;
