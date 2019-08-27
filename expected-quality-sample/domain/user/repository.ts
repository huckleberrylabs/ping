import { ID } from "../id";
import { User } from "./model";

export class UserRepository {
  static async getByID(id: ID): Promise<User | null> {
    throw new Error("Not Implemented Yet");
  }
}
