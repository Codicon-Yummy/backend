import cors from 'cors';
import dotenv from 'dotenv';
import express, { Express } from 'express';
import logger from 'morgan';
import process from 'process';

import { MongoDBConnection } from './db';
import { setupRoutes } from './routes';

dotenv.config();
const app: Express = express();

// middlewares
app.use(express.json());
app.use(logger('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(cors());

setupRoutes(app);

app.get('/hello', (req, res) => {
  res.status(200).json({ status: 'Online' });
});

const start = async () => {
  const port = process.env.PORT;

  try {
    await MongoDBConnection.connect();

    app.listen(port, () => {
      console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
    });
  } catch (e) {
    console.error(e);
  }
};

start();
