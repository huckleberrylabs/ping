import React from "react";
import moment from "moment";
import { useHistory } from "react-router-dom";

// Button
import { Button } from "@rmwc/button";
import "@rmwc/button/styles";

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

// Config
import { Routes } from "../../config";

// Style
import "./style.css";

const conversations = [
  {
    id: "123",
    messages: ["123", "234", "23434", "344", "344"],
    created: "2020-07-17T05:00:29+00:00",
    lastActive: "2020-07-17T05:00:29+00:00",
  },
];

export const Conversations = () => {
  const history = useHistory();

  const conversationRow = (convo: any) => (
    <DataTableRow
      key={convo.id}
      onClick={() => history.push(`${Routes.conversations}/${convo.id}`)}
    >
      <DataTableCell>
        <Button>View</Button>
      </DataTableCell>
      <DataTableCell>{convo.messages.length}</DataTableCell>
      <DataTableCell alignEnd>
        {moment(convo.created).format("ddd, MMMM Do YYYY, h:mm a")}
      </DataTableCell>
      <DataTableCell alignEnd>
        {moment(convo.lastActive).fromNow()}
      </DataTableCell>
    </DataTableRow>
  );
  return (
    <>
      <h1>Conversations</h1>
      <DataTable className="conversations-data-table">
        <DataTableContent>
          <DataTableHead>
            <DataTableRow>
              <DataTableHeadCell></DataTableHeadCell>
              <DataTableHeadCell>Messages</DataTableHeadCell>
              <DataTableHeadCell alignEnd>Created</DataTableHeadCell>
              <DataTableHeadCell alignEnd>Last Active</DataTableHeadCell>
            </DataTableRow>
          </DataTableHead>
          <DataTableBody>{conversations.map(conversationRow)}</DataTableBody>
        </DataTableContent>
      </DataTable>
    </>
  );
};
