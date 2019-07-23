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

exports.default = (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");

  if (req.method === "OPTIONS") {
    // Send response to OPTIONS requests
    res.set("Access-Control-Allow-Methods", "GET");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    res.set("Access-Control-Max-Age", "3600");
    res.status(204).send("");
  } else {
    const user = config.users[req.query.app_id];
    res.status(200).send(JSON.stringify(user));
  }
};
