import { NowRequest, NowResponse } from "@now/node";
import maps, {
  PlaceAutocompleteRequest,
  PlaceAutocompleteResponse,
  GoogleMapsClient,
} from "@google/maps";

/* 

I want to validate that Events, Commands and Queries are:

- signed by the agent
- correct format


components: ["country:us|country:ca"]

Validate:

- Method should be POST
- URL should be https://api.huckleberry.app
- Cookies should be verified via JWT, parsed and used accordingly

I don't need to use URL, Method, Headers, Query.
I Should save HTTPRequestEvents.

Options: 

1. GoogleMapsQuery in the Body

  req.method;
  req.query;
  req.headers;
  req.cookies;
  req.body;

*/

export const validateHTTPRequest = async (
  req: NowRequest,
  res: NowResponse
) => {
  const isCorrectUrl = (req.url = process.env.API_URL + "/events");
  const isPost = req.method === "POST";
};

export default async (req: NowRequest, res: NowResponse) => {
  const query: PlaceAutocompleteQuery = req.body;
  res.send(placeAutocomplete(query));
};

let client: GoogleMapsClient;
if (process.env.GOOGLE_API_KEY) {
  client = maps.createClient({
    key: process.env.GOOGLE_API_KEY,
  });
} else {
  throw new Error("BAH!");
}

type PlaceAutocompleteQuery = PlaceAutocompleteRequest & {
  sessiontoken: undefined;
};

async function placeAutocomplete(
  query: PlaceAutocompleteQuery
): Promise<PlaceAutocompleteResponse> {
  const response = await client
    .placesAutoComplete({
      ...query,
      sessiontoken: "",
    })
    .asPromise();
  return response.json;
}
