import { Router } from 'express';

import { createTicket, getChats, getTicket, getTickets, messageToUpdateTheTicket, updateTicket } from './controller';

const router = Router();

router.get('/', getTickets);

router.get('/:id', getTicket);

router.post('/', createTicket);

router.put('/:id', updateTicket);

router.post('/:ticketNumber/messages', messageToUpdateTheTicket);

router.put('/:id/close', updateTicket);

router.get('/:ticketNumber/chats', getChats);

export default router;
