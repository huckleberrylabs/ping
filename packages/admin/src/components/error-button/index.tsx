import React from "react";

import { Button } from "@rmwc/button";
import "@rmwc/button/styles";
import "./style.css";

export const ErrorButton = () => (
  <div className="error-button">
    <span>An Error Occured :/</span>
    <Button onClick={() => window.location.reload()} raised>
      Reload
    </Button>
  </div>
);
