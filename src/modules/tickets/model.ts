import * as mongoose from 'mongoose';

type Message = {
  sender: string;
  content: string;
};

export interface ITicket extends mongoose.Document {
  initialContext: string;
  chat: Message[];
  status: 'open' | 'pending' | 'resolved';
}

const TicketSchema = new mongoose.Schema(
  {
    initialContextil: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      default: 'pending',
    },
    chat: {
      type: Array<Message>,
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  },
);

const Ticket = mongoose.model<ITicket>('Ticket', TicketSchema);

export default Ticket;
