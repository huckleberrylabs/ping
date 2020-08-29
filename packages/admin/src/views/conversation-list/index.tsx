import React from "react";
import moment from "moment";
import { useHistory } from "react-router-dom";
import { useObservable } from "../../observable";
import { toast } from "react-toastify";
import { conversationService, ConversationStates } from "../../services";
import { Routes } from "../../config";
import { Errors } from "@huckleberrylabs/ping-core";

// UI
import { ErrorButton } from "../../components/error-button";
import { Loading } from "../../components/loading";
import { Button } from "@rmwc/button";
import "@rmwc/button/styles";
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

export const Conversations = () => {
  const state = useObservable(conversationService.state);
  const map = useObservable(conversationService.map);
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
  if (state === ConversationStates.IDLE)
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
            <DataTableBody>
              {Array.from(map.entries())
                .map(([id, conversation]) => conversation)
                .map(conversationRow)}
            </DataTableBody>
          </DataTableContent>
        </DataTable>
      </>
    );
  if (state === ConversationStates.UNINITIALIZED)
    conversationService.getByAccount();
  if (Errors.Is(state)) {
    if (Errors.NotFound.Is(state)) {
      return <div>No Conversations Found</div>;
    } else {
      // @ts-ignore
      toast.error(state.userMessage);
      return <ErrorButton />;
    }
  }
  // ConversationStates.LOADING
  return <Loading />;
};
