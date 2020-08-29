import React from "react";

import { CircularProgress } from "@rmwc/circular-progress";
import "@rmwc/circular-progress/styles";
import "./style.css";

export const Loading = () => (
  <div className="loading">
    <CircularProgress size="xlarge" />
  </div>
);
