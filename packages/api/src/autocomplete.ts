import { NowRequest, NowResponse } from "@now/node";
import axios from "axios";

export default async (req: NowRequest, res: NowResponse) => {
  const ADDRESS_URL = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${req.query.input}&types=address&location=56.130366,-106.346771&radius=3500000&strictbounds&key=${process.env.GOOGLE_API_KEY}`;
  const response = await axios.get(ADDRESS_URL);
  res.send(response.data.predictions);
};
