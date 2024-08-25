import { Router } from 'express';

import {
  closeTicket,
  createTicket,
  getChats,
  getTicket,
  getTickets,
  messageToUpdateTheTicket,
  updateTicket,
} from './controller';

const router = Router();

router.get('/', getTickets);

router.get('/:id', getTicket);

router.post('/', createTicket);

router.put('/:id', updateTicket);

router.post('/:ticketNumber/messages', messageToUpdateTheTicket);

router.put('/:ticketNumber/close', closeTicket);

router.get('/:ticketNumber/chats', getChats);

// router.post('/delete-test', deleteTicketsWithoutChats);

export default router;
