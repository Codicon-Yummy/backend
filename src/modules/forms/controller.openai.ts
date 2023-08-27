import dotenv from 'dotenv';
import { Configuration, OpenAIApi } from 'openai';
import process from 'process';

dotenv.config();

const configuration = new Configuration({
  organization: process.env.OPEN_AI_ORGANIZATION!,
  apiKey: process.env.OPEN_AI_API_KEY!,
});

const openai = new OpenAIApi(configuration);

export const createNameTicket = async ({ content }: { content: string }) => {
  return openai
    .createChatCompletion({
      messages: [
        {
          role: 'assistant',
          content: `
          Resumir el siguiente problema del usuario en un título breve para un ticket: "El usuario reportó que su pedido tardó mucho tiempo en llegar."
          Respuesta esperada: "Pedido retrasado" 
          
          Aquí te proporciono diferentes escenarios de prueba con su posible entrada (lo que reporta el usuario) y una salida esperada (el título o motivo del ticket):
          
          Entrada: El usuario mencionó que el artículo que recibió está dañado.
          Salida esperada: Artículo dañado
          
          Entrada: El cliente se quejó de que el servicio al cliente no respondió a sus llamadas.
          Salida esperada: Servicio al cliente no responde
          
          Entrada: El usuario dijo que la aplicación se cierra inesperadamente cuando intenta abrir una sección específica.
          Salida esperada: Aplicación se cierra inesperadamente
          
          Entrada: El cliente informó que el costo mostrado en el carrito es diferente al costo final al momento de pagar.
          Salida esperada: Discrepancia en el costo
          
          Entrada: El usuario dijo que el manual del producto está en un idioma diferente y no puede entenderlo.
          Salida esperada: Manual en idioma incorrecto
          
          Entrada: El cliente expresó su insatisfacción debido a que el paquete llegó abierto.
          Salida esperada: Paquete recibido abierto
          
          Entrada: El usuario reportó que el software no es compatible con su sistema operativo.
          Salida esperada: Incompatibilidad de software
          
          Entrada: El cliente se quejó de que el tiempo de espera en línea para hablar con un representante es demasiado largo.
          Salida esperada: Tiempo de espera prolongado
          
          Entrada: El usuario mencionó que el color del producto recibido no coincide con lo que seleccionó en línea.
          Salida esperada: Color incorrecto del producto
          
          Entrada: El cliente dijo que su cuenta fue bloqueada sin motivo aparente.
          Salida esperada: Cuenta bloqueada sin razón
        `,
        },
        {
          role: 'user',
          content: content ?? 'Hola, mi pedido tardó mucho tiempo en llegar.',
        },
      ],
      model: 'gpt-3.5-turbo',
      max_tokens: 80,
    })
    .then((response) => {
      return response?.data?.choices[0]?.message?.content ?? '';
    })
    .catch((e) => {
      throw e;
    });
};
