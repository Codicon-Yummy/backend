import * as mongoose from 'mongoose';

const MODEL_NAME = 'Form';

export interface IForm extends mongoose.Document {
  _id: string;
  first_name: string;
  last_name: string;
  dni: string;
  passport: string;
  marital_status: string;
  comments?: string;
}

const FormSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      // TODO: use const from user model
      ref: 'User',
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  },
);

const Form = mongoose.model<IForm>(MODEL_NAME, FormSchema);

export default Form;
