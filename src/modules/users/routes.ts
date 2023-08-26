import { Router } from 'express';

import { verifyJWT } from '../auth/middleware';
import { validateObjectId } from '../utils';
import { createUser, deleteUser, getUser, getUsers, updateUser } from './controller';

const router = Router();

router.get('/', getUsers);

router.get('/:id', getUser);

router.post('/', createUser);

router.put('/:id', verifyJWT, validateObjectId, updateUser);

router.delete('/:id', deleteUser);

export default router;
