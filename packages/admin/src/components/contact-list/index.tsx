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

type Contact = {
  id: string;
  name: string;
  phone: string;
  createdAt: string;
};

const ContactRow = (contact: Contact) => (
  <DataTableRow key={contact.id}>
    <DataTableCell>{contact.name}</DataTableCell>
    <DataTableCell>{contact.phone}</DataTableCell>
    <DataTableCell alignEnd>
      {moment(contact.createdAt).format("ddd, MMMM Do YYYY, h:mm a")}
    </DataTableCell>
  </DataTableRow>
);

type Props = {
  contacts: Contact[];
};

export const ContactList = (props: Props) => {
  return (
    <DataTable className="contact-list">
      <DataTableContent>
        <DataTableHead>
          <DataTableRow>
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
