import { Router } from 'express';

import { createTicket, getChats, getTicket, getTickets, updateTicket } from './controller';

const router = Router();

router.get('/', getTickets);

router.get('/:id', getTicket);

router.post('/', createTicket);

router.put('/:id', updateTicket);

router.put('/:id/close', updateTicket);

router.get('/:ticketNumber/chats', getChats);

export default router;
