const fs = require("fs");
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(
  "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"
);

const from = "mossab@askhuckleberry.com";

const subject = "When's a good time to call?";

const html = fs.readFileSync("email.html").toString();
const emailArray = fs
  .readFileSync("emails4.csv")
  .toString()
  .split("\n")
  .map(item => item.split(","));

const text = first_name => ` 
Hi ${first_name},

Hope you are enjoying these last days of summer!

My name is Mossab, I am the CEO of Waterloo based startup Huckleberry AI.

We build tools and experiences that improve the way consumers discover and interact with real estate.

Can I give you a call in the next few weeks? I'd love to tell you about how we help Realtors and get your feedback.



Cheers,

Mo

_

Mossab Otman Basir

Huckleberry

Real estate, powered by machine learning.

Visit us at askhuckleberry.com for more information.

Our texting app is located here: https://text.huckleberry.app
`;
console.log(emailArray);

emailArray.forEach(elem => {
  const msg = {
    to: elem[1],
    from,
    subject,
    text: text(elem[0])
    // html
  };
  sgMail.sendMultiple(msg).catch(response => {
    console.log(JSON.stringify(response));
  });
});
