import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./style.css";

type Props = { offset?: boolean };

export const ToastProvider = (props: Props) => (
  <ToastContainer
    className={props.offset ? "toastify-with-app-bar" : ""}
    position="top-right"
    autoClose={3500}
    hideProgressBar
    newestOnTop={false}
    closeOnClick
    rtl={false}
    draggable
    pauseOnHover
  />
);
