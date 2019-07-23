import axios from "axios";
import { GoogleAutoCompleteResult } from "../../models/google-autocomplete-result";
import { Coordinates } from "../../models";

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
