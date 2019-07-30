import { NowRequest, NowResponse } from "@now/node";

export default async (req: NowRequest, res: NowResponse) => {
  res.send(
    `Hello World, your req url: ${req.url} \n your req query ${JSON.stringify(
      req.query
    )}`
  );
};
