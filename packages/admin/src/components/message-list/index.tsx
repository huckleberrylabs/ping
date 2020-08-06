import React from "react";
import moment from "moment";

// Data Table
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

// Style
import "./style.css";

const MessageRow = (message: Message) => (
  <DataTableRow key={message.id}>
    <DataTableCell>{message.from}</DataTableCell>
    <DataTableCell>{message.channel}</DataTableCell>
    <DataTableCell className="message-list-content-cell">
      {message.content}
    </DataTableCell>
    <DataTableCell>{message.meta}</DataTableCell>
    <DataTableCell alignEnd>
      {moment(message.timestamp).format("ddd, MMMM Do YYYY, h:mm a")}
    </DataTableCell>
  </DataTableRow>
);

type Message = {
  id: string;
  timestamp: string;
  from: string;
  channel: string;
  content: string;
  meta: string;
};

type Props = {
  messages: Message[];
};

export const MessageList = (props: Props) => {
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
