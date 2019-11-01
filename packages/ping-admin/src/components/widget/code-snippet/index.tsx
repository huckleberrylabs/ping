import React from "react";

// Code Block
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";

// Ripple
import { Ripple } from "@rmwc/ripple";
import "@material/ripple/dist/mdc.ripple.css";

// Icon
import { Icon } from "@rmwc/icon";
import "@rmwc/icon/icon.css";

// Style
import "./style.css";

// Domain
import { UUID, Env } from "@huckleberryai/core";

export const prodCodeString = (id: UUID.T) =>
  `
  <script src="https://client.ping.buzz/ping.min.js?widget_id=${id}" id="huckleberry-ping-insert-script"></script>
  `;

const devCodeString = (id: UUID.T) =>
  `
  <script src="file:///Users/dado/Projects/monorepo/packages/ping-client/dist/ping.min.js?widget_id=${id}" id="huckleberry-ping-insert-script"></script>
  `;

const codeString = Env.Get() === "development" ? devCodeString : prodCodeString;

type Props = {
  id: UUID.T;
};

export const WidgetCodeSnippet = (props: Props) => (
  <div>
    <p>
      Copy this code and insert it as high as possible inside the head tag of
      your website. If you'd like assistance, please reach out to us at
      support@ping.buzz.
    </p>
    <Ripple primary>
      <div
        className="widget-code-snippet-container"
        onClick={() => {
          const textarea = document.createElement("textarea");
          textarea.setAttribute("type", "hidden");
          textarea.textContent = codeString(props.id);
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand("copy");
          textarea.remove();
        }}
      >
        <SyntaxHighlighter language="html" style={docco}>
          {codeString(props.id)}
        </SyntaxHighlighter>
        <Icon
          className="widget-code-snippet-copy-icon"
          icon="file_copy"
          theme="textSecondaryOnLight"
        />
      </div>
    </Ripple>
  </div>
);
