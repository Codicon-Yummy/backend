import * as mongoose from 'mongoose';
import { Model } from 'mongoose';

export type Message = {
  senderBy: 'client' | 'customerService';
  content: string;
  createAt: Date;
};

export type SuggestIA = {
  options: string[];
  suggests: string[];
};

export type Chat = {
  messages: Message[];
  suggest: SuggestIA;
};

export interface ITicket extends mongoose.Document {
  userId: number;
  initialContext: string;
  chat: { messages: Message[]; suggest: SuggestIA };
  status: 'open' | 'pending' | 'resolved';
  number: number;
}

const messageSchema = new mongoose.Schema(
  {
    senderBy: String,
    content: String,
    createAt: Date,
  },
  { _id: false },
);

const suggestIASchema = new mongoose.Schema(
  {
    options: [String],
    suggests: [String],
  },
  { _id: false },
);

const chatSchema = new mongoose.Schema(
  {
    messages: [messageSchema],
    suggest: [suggestIASchema],
  },
  { _id: false },
);

const TicketSchema = new mongoose.Schema(
  {
    initialContext: {
      type: String,
    },
    status: {
      type: String,
      default: 'pending',
    },
    chat: {
      type: chatSchema,
    },
    number: { type: Number, unique: true, default: 0 },
    reason: {
      type: String,
    },
    userId: {
      type: Number,
    }
  },
  {
    versionKey: false,
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  },
);

TicketSchema.pre<ITicket>('save', async function (next) {
  if (this.isNew) {
    try {
      const TicketModel = mongoose.model('Ticket') as Model<ITicket>;
      const lastOrder = await TicketModel.findOne().sort({ number: -1 }).select('number');
      const nextNumber = lastOrder ? lastOrder.number + 1 : 1;
      this.number = nextNumber;
      next();
    } catch (error: any) {
      next(error);
    }
  } else {
    next();
  }
});

const Ticket = mongoose.model<ITicket>('Ticket', TicketSchema);

export default Ticket;
