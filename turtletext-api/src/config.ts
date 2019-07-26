import { NowRequest, NowResponse } from "@now/node";
import { apps } from "./apps";

export default async (req: NowRequest, res: NowResponse) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") {
    // Send response to OPTIONS requests
    res.setHeader("Access-Control-Allow-Methods", "GET");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Max-Age", "3600");
    res.status(204).send("");
  } else {
    if (typeof req.query.app_id === "string") {
      const app = apps.filter(app => app.id === req.query.app_id)[0];
      res.status(200).json(app);
    }
  }
};
