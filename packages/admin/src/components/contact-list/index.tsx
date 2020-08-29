import React from "react";
import moment from "moment";
import { isSome } from "fp-ts/lib/Option";
import { Messaging, PersonName } from "@huckleberrylabs/ping-core";

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

const ContactRow = (contact: Messaging.Contact.Model.T) => (
  <DataTableRow key={contact.id}>
    <DataTableCell>{contact.internal ? "Yes" : "No"}</DataTableCell>
    <DataTableCell>
      {isSome(contact.name) ? PersonName.FirstLast(contact.name.value) : "None"}
    </DataTableCell>
    <DataTableCell>{contact.phone.number}</DataTableCell>
    <DataTableCell alignEnd>
      {moment(contact.created).format("ddd, MMMM Do YYYY, h:mm a")}
    </DataTableCell>
  </DataTableRow>
);

type Props = {
  contacts: Messaging.Contact.Model.T[];
};

export const ContactList = (props: Props) => {
  return (
    <DataTable className="contact-data-table">
      <DataTableContent>
        <DataTableHead>
          <DataTableRow>
            <DataTableHeadCell>Internal</DataTableHeadCell>
            <DataTableHeadCell>Name</DataTableHeadCell>
            <DataTableHeadCell>Phone</DataTableHeadCell>
            <DataTableHeadCell alignEnd>Created</DataTableHeadCell>
          </DataTableRow>
        </DataTableHead>
        <DataTableBody>{props.contacts.map(ContactRow)}</DataTableBody>
      </DataTableContent>
    </DataTable>
  );
};
