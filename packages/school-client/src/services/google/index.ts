import axios from "axios";
import { GoogleAutoCompleteResult } from "../../../../packages/models/src/google-autocomplete-result";
import { Coordinates } from "../../../../packages/models/src";

export class GoogleService {
  async autoCompleteAddress(
    input: string
  ): Promise<GoogleAutoCompleteResult[]> {
    const res = await axios.get<GoogleAutoCompleteResult[]>(
      `api/autocomplete?input=${input}`
    );
    return res.data;
  }
  async getCoordinates(address: string): Promise<Coordinates> {
    const response = await axios.get(`api/geocode?input=${address}`);
    return response.data;
  }
}
