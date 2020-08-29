import React, { FunctionComponent } from "react";
import "./style.css";

type Props = { open: boolean; onClose: () => void };
export const Modal: FunctionComponent<Props> = ({
  open,
  onClose,
  children,
}) => {
  return (
    <>
      <div
        className={open ? "modal-overlay-open" : "modal-overlay-closed"}
        onClick={onClose}
      ></div>
      <div className={open ? "modal-open" : "modal-closed"}>{children}</div>
    </>
  );
};
