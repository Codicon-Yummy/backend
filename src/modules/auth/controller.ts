import * as z from 'zod';

import { BadRequest } from '../../http/HttpHandler';
import { IAuthLogin } from '../users/model';

// Define the validation schema for the entity
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// Define the interface for the entity
type Entity = IAuthLogin;

// Define the controller for the POST route
export class LoginController {
  createEntity(data: unknown): Entity {
    // Validate the object using the validation schema
    const validatedObject = loginSchema.safeParse(data);

    // If the object is not valid, throw an exception
    if (!validatedObject.success) {
      throw new BadRequest(400, 'The object is not valid');
    }

    // If the object is valid, create the entity and return it
    const entity: Entity = {
      email: validatedObject.data.email,
      password: validatedObject.data.password,
    };

    // Here you could save the entity to the database or another storage system
    return entity;
  }

  handlePost(data: unknown): Entity {
    return this.createEntity(data);
  }
}
