import { Router } from 'express';

// import { verifyJWT } from '../auth/middleware';
import { validateObjectId } from '../utils';
import { createTicket, getTicket, getTickets, updateTicket } from './controller';

const router = Router();

router.get('/', getTickets);

router.get('/:id', getTicket);

router.post('/', createTicket);

router.put('/:id', validateObjectId, updateTicket);

export default router;
