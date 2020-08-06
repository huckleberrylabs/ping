import React from "react";

// Code Block
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";

// Toast
import { toast } from "react-toastify";

// Ripple
import { Ripple } from "@rmwc/ripple";
import "@rmwc/ripple/styles";

// Icon
import { Icon } from "@rmwc/icon";
import "@rmwc/icon/styles";

// Style
import "./style.css";

// Config
import { Config } from "@huckleberrylabs/ping-core";

export const CodeString = (id: string) =>
  `
  <script src="${Config.InsertScriptURL}?widget_id=${id}" id="${Config.InsertScriptID}"></script>
  `;

type Props = {
  id: string;
};

export const WidgetCodeSnippet = (props: Props) => (
  <div className="widget-code-snippet-container">
    <p>
      copy this code and insert it as high as possible inside the head tag of
      your website. if you'd like assistance, please reach out to us at{" "}
      <a href={`mail-to:${Config.SupportEmail}`}>{Config.SupportEmail}</a>
    </p>
    <Ripple primary>
      <div
        className="widget-code-snippet"
        onClick={() => {
          const textarea = document.createElement("textarea");
          textarea.setAttribute("type", "hidden");
          textarea.textContent = CodeString(props.id);
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand("copy");
          textarea.remove();
          toast.info("copied!");
        }}
      >
        <SyntaxHighlighter language="html" style={docco}>
          {CodeString(props.id)}
        </SyntaxHighlighter>
        <Icon icon="file_copy" theme="textSecondaryOnLight" />
      </div>
    </Ripple>
  </div>
);
