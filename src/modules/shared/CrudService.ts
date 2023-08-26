import { Document, Model } from 'mongoose';

interface IData {
  [key: string]: any;
}

class CrudService<T extends Document> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async create(data: IData): Promise<T> {
    return await this.model.create(data);
  }

  async update(id: string, data: IData): Promise<T | null> {
    const updatedData = await this.model.findByIdAndUpdate(id, data, { new: true }).exec();
    return updatedData;
  }

  async getAll(populateFields?: string | string[]): Promise<T[]> {
    if (populateFields) {
      return await this.model.find().populate(populateFields).exec();
    }
    return await this.model.find().exec();
  }

  async findOne(id: string): Promise<T | null> {
    return await this.model.findOne({ _id: id }).exec();
  }

  async findById(id: string): Promise<T | null> {
    return await this.model.findById(id).exec();
  }

  async delete(_id: string): Promise<{ ok?: number; n?: number; deletedCount?: number }> {
    return await this.model.deleteOne({ _id }).exec();
  }
}

export = CrudService;
