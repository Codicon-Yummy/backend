import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

import { USER_ROLES } from '../users/controller';

const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('x-token');

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied',
    });
  }

  try {
    res.locals.user = jwt.verify(token, process.env.JWT_SECRET!);
    next();
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: 'Invalid token',
    });
  }
};

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

export const checkRole = (role: UserRole) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = res.locals.user.role;

    if (userRole !== role) {
      return res.status(403).json({ success: false, message: 'Acceso denegado' });
    }

    next();
  };
};

export { verifyJWT };
