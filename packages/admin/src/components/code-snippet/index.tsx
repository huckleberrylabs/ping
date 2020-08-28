import React from "react";
import { Config } from "@huckleberrylabs/ping-core";

// UI
import { toast } from "react-toastify";
import { Ripple } from "@rmwc/ripple";
import "@rmwc/ripple/styles";
import { Icon } from "@rmwc/icon";
import "@rmwc/icon/styles";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import "./style.css";

export const CodeString = (id: string) =>
  `
  <script src="${Config.InsertScriptURL}?widget_id=${id}" id="${Config.InsertScriptID}"></script>
  `;

type Props = {
  id: string;
};

export const WidgetCodeSnippet = (props: Props) => (
  <div className="code-snippet">
    <p>
      Copy this code and insert it as high as possible inside the head tag of
      your website. If you'd like assistance, please reach out to us at{" "}
      <a href={`mail-to:${Config.SupportEmail}`}>{Config.SupportEmail}</a>.
    </p>
    <Ripple primary>
      <div
        className="code-snippet-inner"
        onClick={() => {
          const textarea = document.createElement("textarea");
          textarea.setAttribute("type", "hidden");
          textarea.textContent = CodeString(props.id);
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand("copy");
          textarea.remove();
          toast.info("Copied!");
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
