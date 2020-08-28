import React from "react";
import moment from "moment";
import { Messaging } from "@huckleberrylabs/ping-core";

// UI
import {
  DataTable,
  DataTableContent,
  DataTableHead,
  DataTableHeadCell,
  DataTableBody,
  DataTableRow,
  DataTableCell,
} from "@rmwc/data-table";
import "@rmwc/data-table/styles";
import "./style.css";

const MessageRow = (message: Messaging.Message.Model.T) => (
  <DataTableRow key={message.id}>
    <DataTableCell>{message.from}</DataTableCell>
    <DataTableCell>{message.channel}</DataTableCell>
    <DataTableCell className="message-list-content-cell">
      {message.content}
    </DataTableCell>
    <DataTableCell>{JSON.stringify(message.meta)}</DataTableCell>
    <DataTableCell alignEnd>
      {moment(message.timestamp).format("ddd, MMMM Do YYYY, h:mm a")}
    </DataTableCell>
  </DataTableRow>
);

type Props = {
  messages: Messaging.Message.Model.T[];
};

export const MessageList = (props: Props) => {
  console.log(props.messages);
  return (
    <DataTable className="message-list">
      <DataTableContent>
        <DataTableHead>
          <DataTableRow>
            <DataTableHeadCell>From</DataTableHeadCell>
            <DataTableHeadCell>Channel</DataTableHeadCell>
            <DataTableHeadCell>Content</DataTableHeadCell>
            <DataTableHeadCell>Metadata</DataTableHeadCell>
            <DataTableHeadCell alignEnd>Timestamp</DataTableHeadCell>
          </DataTableRow>
        </DataTableHead>
        <DataTableBody>{props.messages.map(MessageRow)}</DataTableBody>
      </DataTableContent>
    </DataTable>
  );
};
