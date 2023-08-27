import { Router } from 'express';

const router = Router();

import { IForm } from './model';
import { createChatCompletion, createContent } from './service.openai';

router.post('/generate', async (req, res) => {
  try {
    // const user_id = res.locals.user.id;
    const user_id = '64ea3d4f4870ff7f457627d7';
    console.log('go');
    const response = await createChatCompletion({
      content: createContent({
        first_name: 'Juan',
        last_name: 'Perez',
        comments: 'Me persiguen',
      } as IForm),
    });

    res.json({
      message: 'success',
      content: JSON.parse(response),
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
