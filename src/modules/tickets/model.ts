import * as mongoose from 'mongoose';
import { Model } from 'mongoose';

type Message = {
  senderBy: 'client' | 'customerService';
  content: string;
  createAt: Date;
};

export interface ITicket extends mongoose.Document {
  initialContext: string;
  chat: Message[];
  status: 'open' | 'pending' | 'resolved';
  number: number;
}

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
      type: Array<Message>,
    },
    number: { type: Number, unique: true, default: 0 },
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
