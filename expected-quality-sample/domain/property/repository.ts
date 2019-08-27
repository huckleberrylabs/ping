import { ID } from "../id";
import { Property } from "./model";

export class PropertyRepository {
  static async getByID(id: ID): Promise<Property | null> {
    throw new Error("Not Implemented Yet");
  }
}
