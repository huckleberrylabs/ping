const config = {
  users: {
    "8dd52f8a-6061-416b-84b3-ea841a11cd06": {
      phone: "+16472951647",
      mainColor: "white",
      accentColor: "#0077ae",
      defaultMessage: "Hi, I would like to learn more about TurtleText.",
    },
  },
};

var twilio = require("twilio");

var accountSid = process.env.TWILIO_ACCOUNT_SID;
var authToken = process.env.TWILIO_AUTH_TOKEN;
var client = new twilio(accountSid, authToken);

exports.default = (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") {
    // Send response to OPTIONS requests
    res.set("Access-Control-Allow-Methods", "POST");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    res.set("Access-Control-Max-Age", "3600");
    res.status(204).send("");
  } else {
    client.messages
      .create({
        body: `New Message from ${req.body.name}: ${req.body.message}
		\n Reply to them at ${req.body.phone}`,
        to: config.users[req.body.appID].phone,
        from: process.env.TWILIO_PHONE_NUMBER,
      })
      .then(res.status(200).send())
      .catch(err => res.status(400).send(err.toString()));
  }
};
