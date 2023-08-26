import { Express } from 'express';

import auth from './modules/auth/routes';
import forms from './modules/forms/routes';
import users from './modules/users/routes';
import tickets from './modules/tickets/routes';

export const setupRoutes = (app: Express) => {
  const prefix = '/api';

  app.use(`${prefix}/auth`, auth);
  app.use(`${prefix}/users`, users);
  app.use(`${prefix}/forms`, forms);
  app.use(`${prefix}/tickets`, tickets);
};
