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

//
export const getUserAnalysis = async ({ content }: { content: any }) => {
  return openai
    .createChatCompletion({
      messages: [
        {
          role: 'system',
          content: `
          Dado que el usuario ha reportado múltiples problemas con la aplicación de delivery, incluyendo: pedidos fríos, cambios en el tiempo estimado de entrega, problemas con la dirección, cobros dobles, pedidos incorrectos, problemas al añadir direcciones, falta de rastreo en tiempo real, problemas con la cancelación, y falta de seguimiento a instrucciones especiales, ¿cuál es el contexto general o tema principal de sus inquietudes?

El contexto general de las inquietudes del usuario se centra en deficiencias operativas y técnicas de la aplicación de delivery. Sus problemas varían desde la calidad y exactitud de los pedidos hasta problemas técnicos con la plataforma, lo que sugiere un área de mejora tanto en la interfaz del usuario como en la logística del servicio de delivery.
        `,
        },
        {
          role: 'assistant',
          content: 'Estos son los ultimos tickets que se han reportado en la plataforma por el cliente' + content,
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
