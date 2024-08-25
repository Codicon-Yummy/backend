import { Request, Response } from 'express';
// import * as mongoose from 'mongoose';
import { z } from 'zod';

import { createNameTicket, getUserAnalysis } from '../forms/controller.openai';
import { suggestChatCompletion } from '../forms/service.openai';
import { LIST_TICKETS_ORDERS_WITH_ERRORS, LIST_USERS } from '../utils/const';
import Ticket, { Message, SuggestIA } from './model';

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
  const { problemByUser, userId } = req.body;

  try {
    const reason = await createNameTicket({
      content: problemByUser,
    });
    const validatedData = ticketSchema.parse(req.body);

    const chat = {
      messages: [
        {
          senderBy: 'client',
          content: problemByUser,
          createAt: new Date(),
        },
      ] as Message[],
      suggest: [] as SuggestIA[],
    };

    const data = await suggestChatCompletion(chat.messages);
    const newSuggests: SuggestIA = {
      options: data?.options,
      suggests: data?.suggests,
    };

    // @ts-ignore
    chat.suggest = newSuggests;

    const newTicket = await Ticket.create({ ...validatedData, reason, chat, userId });

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

    const newData = {
      ...findTicket,
      user: LIST_USERS.find((user) => user.id === findTicket.userId) ?? {
        id: 0,
        fullName: 'No user',
      },
    };

    res.status(200).json(newData);
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
    const response = await Ticket.findOne({ number: Number(ticketNumber) });

    const chats = {
      ...response?.chat,
      user: LIST_USERS.find((user) => user.id === response?.userId) ?? {
        id: 0,
        fullName: 'No user',
      },
    };

    res.status(200).json(chats);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const messageToUpdateTheTicket = async (req: Request, res: Response) => {
  try {
    const { ticketNumber } = req.params;
    const { senderBy, content } = req.body;
    const current_ticket = await Ticket.findOne({ number: Number(ticketNumber) });

    const message: Message = {
      senderBy: senderBy,
      content: content,
      createAt: new Date(),
    };
    let newSuggests = current_ticket?.chat?.suggest;

    if (senderBy === 'client') {
      if (current_ticket?.chat?.messages) {
        const data = await suggestChatCompletion([message]);
        newSuggests = {
          options: data?.options,
          suggests: data?.suggests,
        };
      } else {
        const data = await suggestChatCompletion([message]);
        newSuggests = {
          options: data?.options,
          suggests: data?.suggests,
        };
      }
    }
    console.log(newSuggests);
    const newChat = [...(current_ticket?.chat?.messages || [])];
    newChat.push(message);
    console.log(newChat);
    const newData = await Ticket.findByIdAndUpdate(
      current_ticket?.id,
      { chat: { messages: newChat, suggest: newSuggests } },
      { new: true },
    );

    res.status(200).json(newData);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const closeTicket = async (req: Request, res: Response) => {
  try {
    const { ticketNumber } = req.params;
    const current_ticket = await Ticket.findOne({ number: Number(ticketNumber) });
    const newData = await Ticket.findByIdAndUpdate(current_ticket?.id, { status: 'resolved' }, { new: true });
    res.status(200).json(newData);
  } catch (e) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};
