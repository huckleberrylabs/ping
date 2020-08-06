import React from "react";
import moment from "moment";

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

// Style
import "./style.css";

const invoices = [
  {
    id: "123",
    date: "2020-07-17T05:00:29+00:00",
    amount: 54.23,
    downloadUrl: "http://localhost:3000/robots.txt",
  },
];

export const Invoices = () => {
  const invoiceRow = (invoice: any) => (
    <DataTableRow key={invoice.id}>
      <DataTableCell>
        {moment(invoice.created).format("YYYY-MM-DD")}
      </DataTableCell>
      <DataTableCell alignEnd>${invoice.amount}</DataTableCell>
      <DataTableCell alignEnd>
        <a
          href={invoice.downloadUrl}
          download={`ping-invoice-${moment(invoice.created).format(
            "YYYY-MM-DD"
          )}.pdf`}
        >
          <Button>pdf</Button>
        </a>
      </DataTableCell>
    </DataTableRow>
  );
  return (
    <>
      <h2>Invoices</h2>
      <DataTable className="invoices-data-table">
        <DataTableContent>
          <DataTableHead>
            <DataTableRow>
              <DataTableHeadCell>Date</DataTableHeadCell>
              <DataTableHeadCell alignEnd>Amount</DataTableHeadCell>
              <DataTableHeadCell alignEnd>Download</DataTableHeadCell>
            </DataTableRow>
          </DataTableHead>
          <DataTableBody>{invoices.map(invoiceRow)}</DataTableBody>
        </DataTableContent>
      </DataTable>
    </>
  );
};
