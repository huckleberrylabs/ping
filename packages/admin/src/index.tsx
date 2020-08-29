import React from "react";
import ReactDOM from "react-dom";
import "./services";
import "./index.css";
import { App } from "./app";
import * as serviceWorker from "./serviceWorker";

// Seeing double toasts? Its probably because the app is surrounded in StrictMode. It will go away when building for production.

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
