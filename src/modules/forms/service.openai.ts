import dotenv from 'dotenv';
import { Configuration, OpenAIApi } from 'openai';
import process from 'process';

import { INITIAL_PROMPT } from '../utils/const';
import { IForm } from './model';

dotenv.config();

const configuration = new Configuration({
  organization: process.env.OPEN_AI_ORGANIZATION!,
  apiKey: process.env.OPEN_AI_API_KEY!,
});

const openai = new OpenAIApi(configuration);

const DATA_DUMMY = {
  first_name: 'Juan',
  last_name: 'Perez',
  payment_method: 'Tarjeta de credito',
  address: 'Calle 123',
  date: '2021-10-10',
};

export const createContent = (data: IForm) => {
  return `
    ${data.first_name} ${data.last_name} He tenido un problema con mi pedido, se me ha debitado el dinero pero no ha recibido el producto.
  `;
  // nombres: ${data.first_name}
  // apellidos: ${data.last_name}
  // sucesos: ${data.comments}
};

export const createChatCompletion = async ({ content }: { content: string }) => {
  return openai
    .createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'assistant',
          content: INITIAL_PROMPT,
        },
        {
          role: 'user',
          content,
        },
      ],
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      // TODO: uncomment this
      // stream: true,
      n: 1,
    })
    .then((response) => {
      return response?.data?.choices[0]?.message?.content;
    })
    .catch((e) => {
      throw e;
    });
};