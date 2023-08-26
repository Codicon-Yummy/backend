import bcrypt from 'bcryptjs';
import jwt, { TokenExpiredError } from 'jsonwebtoken';

export default class PasswordHasher {
  static async hashPassword(password: string) {
    try {
      const salt = await bcrypt.genSalt(10);
      return await bcrypt.hash(password, salt);
    } catch (err) {
      throw new Error('Error hashing password');
    }
  }

  static async comparePasswords(password: string, hashedPassword: string) {
    try {
      return await bcrypt.compare(password, hashedPassword);
    } catch (err) {
      throw new Error('Error comparing passwords');
    }
  }

  static generateJWT(id: string, role = 'user') {
    // TODO: set expiration time
    // return jwt.sign({ id, role }, process.env.JWT_SECRET!, {
    //   expiresIn: '300m',
    // });
    return jwt.sign({ id, role }, process.env.JWT_SECRET!);
  }

  static extractIdFromToken(token: string) {
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

      return decodedToken.id;
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        throw new Error('Token has expired');
      } else {
        throw new Error('Error extracting ID from token');
      }
    }
  }
}
