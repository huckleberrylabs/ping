import { ShowingRequest } from "./model";
import { ID } from "../id";

export class ShowingRequestRepository {
  static async add(showingRequest: ShowingRequest): Promise<null> {
    throw new Error("Not Implemented Yet");
  }
  static async getByID(id: ID): Promise<ShowingRequest> {
    throw new Error("Not Implemented Yet");
  }
  static async getAllByUserID(id: ID): Promise<ShowingRequest[]> {
    throw new Error("Not Implemented Yet");
  }
  static async getAllByPropertyID(id: ID): Promise<ShowingRequest[]> {
    throw new Error("Not Implemented Yet");
  }
}
