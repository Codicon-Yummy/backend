import { Request, Response } from 'express';
// import * as mongoose from 'mongoose';
import { z } from 'zod';

import { createNameTicket } from '../forms/controller.openai';
import Ticket from './model';

export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
} as const;

const ticketSchema = z.object({
  status: z.string(),
  // chat: z.string(),
  initialContext: z.string(),
});

export const createTicket = async (req: Request, res: Response) => {
  const { problemByUser } = req.body;

  try {
    const reason = await createNameTicket({
      content: problemByUser,
    });
    const validatedData = ticketSchema.parse(req.body);

    const newTicket = await Ticket.create({ ...validatedData, reason });

    res.status(201).json({ message: 'Ticket creado con éxito', ticket: newTicket });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.message, errors: error.errors });
    }

    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const getTicket = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const findTicket = await Ticket.findById(id);
    if (!findTicket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.status(200).json(findTicket);
  } catch (e) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const getTickets = async (req: Request, res: Response) => {
  try {
    const tickets = await Ticket.find({ status: 'pending' || 'open' });
    res.status(200).json(tickets);
  } catch (e) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const updateTicket = async (req: Request, res: Response) => {
  try {
    const { idTicket } = req.params;

    const findUser = await Ticket.findOne({
      number: Number(idTicket),
    });

    const ticketId = findUser?._id;

    // const validatedData = ticketSchema.parse(req.body);
    const chat = req.body;

    // TODO: remove password from response
    const updatedTicket = await Ticket.findByIdAndUpdate(ticketId, { ...chat }, { new: true });

    res.status(200).json(updatedTicket);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.message, errors: error.errors });
    }

    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const updateChatByTicketNumber = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const findUser = await Ticket.findById(id);
    if (!findUser) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    const validatedData = ticketSchema.parse(req.body);

    // TODO: remove password from response
    const updatedTicket = await Ticket.findByIdAndUpdate(id, { ...validatedData }, { new: true });

    res.status(200).json(updatedTicket);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.message, errors: error.errors });
    }

    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const getChats = async (req: Request, res: Response) => {
  try {
    const { ticketNumber } = req.params;
    const response = await Ticket.find();

    const chats = response.filter((ticket) => ticket.chat.length > 0);

    // const chatsFiltered = chats.filter((chat) => );

    res.status(200).json(chats);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const messageToUpdateTheTicket = async (req: Request, res: Response) => {
  try {
    const { ticketNumber } = req.params;
    const response = await Ticket.find();

    const chat = response.filter((ticket) => ticket.number === Number(ticketNumber));

    // const chatsFiltered = chats.filter((chat) => );

    res.status(200).json(chat);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: 'Something went wrong' });
  }
};
