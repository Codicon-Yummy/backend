import { Express } from 'express';

import auth from './modules/auth/routes';
import chats from './modules/chats/routes';
import forms from './modules/forms/routes';
import tickets from './modules/tickets/routes';
import users from './modules/users/routes';

export const setupRoutes = (app: Express) => {
  const prefix = '/api';

  app.use(`${prefix}/auth`, auth);
  app.use(`${prefix}/users`, users);
  app.use(`${prefix}/forms`, forms);
  app.use(`${prefix}/tickets`, tickets);
  app.use(`${prefix}/chats`, chats);
};
