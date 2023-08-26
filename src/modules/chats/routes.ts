import { Router } from 'express';

import { getChats } from './../tickets/controller';

const router = Router();

router.get('/', getChats);

export default router;
