import { NowRequest, NowResponse } from "@now/node";
import twilio from "twilio";
import { apps } from "./apps";

const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const client = twilio(twilioAccountSid, twilioAuthToken);

export default async (req: NowRequest, res: NowResponse) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") {
    // Send response to OPTIONS requests
    res.setHeader("Access-Control-Allow-Methods", "GET");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Max-Age", "3600");
    res.status(204).send("");
  } else {
    client.messages
      .create({
        body: `New Message from ${req.body.name}: ${req.body.message}
		\n Reply to them at ${req.body.phone}`,
        to: apps.filter(app => app.id === req.body.appID)[0].phone,
        from: twilioPhoneNumber,
      })
      .then(() => res.status(200).send(null))
      .catch(err => res.status(400).send(err.toString()));
  }
};
