import { NextFunction, Request, Response } from 'express';
import * as mongoose from 'mongoose';

const validateObjectId = (req: Request, res: Response, next: NextFunction) => {
  // TODO: this parameter could be dynamic
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid ObjectId' });
  }

  next();
};

export { validateObjectId };
