import * as mongoose from 'mongoose';
import * as process from 'process';

class MongoDB {
  private static instance: MongoDB | null = null;

  private constructor() {}

  static getInstance(): MongoDB {
    if (MongoDB.instance === null) {
      MongoDB.instance = new MongoDB();
    }

    return MongoDB.instance;
  }

  async connect() {
    try {
      mongoose.set('strictQuery', false);
      await mongoose.connect(process.env.MONGO_DB || '');
    } catch (error) {
      console.error(error);
    }
  }
}

export const MongoDBConnection = MongoDB.getInstance();
