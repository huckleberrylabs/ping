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
    const app = apps.filter(app => app.id === req.body.appID)[0];
    const stylesheet = generateStyleSheet(app.mainColor, app.accentColor);
    res.setHeader("Content-Type", "text/css");
    res.status(200).send(stylesheet);
  }
};

function generateStyleSheet(mainColor: string, accentColor: string) {
  return `:root {
  --turtle-text-main-color: ${mainColor};
  --turtle-text-accent-color: ${accentColor};
  --turtle-text-success-color: #00ae4e;
  --turtle-text-fail-color: #ae0034;
}
#turtle-text-container * {
  font-size: 14px;
  font-family: Arial, Helvetica, sans-serif;
}
#turtle-text-container {
  position: fixed;
  z-index: 2147483647;
  bottom: 24px;
  right: 24px;
  width: 64px;
  max-width: 90vw;
  height: 64px;
  border-radius: 3rem;
  overflow: hidden;
  transition: width 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55);
  background-color: var(--turtle-text-main-color);
  box-shadow: 0 3px 7px rgba(0, 0, 0, 0.25);
}
#turtle-text-form {
  width: 100%;
  height: 100%;
}
#turtle-text-form button,
#turtle-text-form input,
#turtle-text-invalid-message,
#turtle-text-success-message,
#turtle-text-error-message {
  position: absolute;
  height: 100%;
  border: none;
  outline: none;
  top: 0;
  right: 0;
  bottom: 0;
  transform: scale(0);
  opacity: 0;
}
#turtle-text-form button {
  width: 20%;
  padding: 0;
  border-radius: 3rem;
  cursor: pointer;
  background-color: var(--turtle-text-accent-color);
  color: var(--turtle-text-main-color);
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.3);
}
#turtle-text-form input {
  width: 100%;
  background-color: var(--turtle-text-main-color);
  box-sizing: border-box;
  padding: 0 20px;
}

#turtle-text-container > #turtle-text-form .shown {
  transition: all 0.4s ease 0.4s;
  transform: scale(1);
  opacity: 1;
}

#turtle-text-form #turtle-text-open-button {
  width: 100%;
}
#turtle-text-invalid-message,
#turtle-text-success-message,
#turtle-text-error-message {
  display: flex;
  justify-content: center;
  align-items: center;
  left: 0;
  color: var(--turtle-text-success-color);
}

#turtle-text-invalid-message,
#turtle-text-error-message {
  color: var(--turtle-text-fail-color);
}`;
}
