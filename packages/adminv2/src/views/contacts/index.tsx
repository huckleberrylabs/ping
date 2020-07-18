import React from "react";
import { ContactList } from "../../components/contact-list";
import "./style.css";

const contacts = [
  {
    id: "123",
    name: "Dragos Rotaru",
    phone: "+16472951647",
    createdAt: "2020-07-17T05:00:19+00:00",
  },
  {
    id: "345",
    name: "Josh Winslow",
    phone: "+15194943009",
    createdAt: "2020-07-13T03:17:29+00:00",
  },
  {
    id: "345",
    name: "Sara Bozek",
    phone: "+14164556594",
    createdAt: "2020-07-10T23:26:46+00:00",
  },
];

export const Contacts = () => {
  return (
    <>
      <h1>Contacts</h1>
      <ContactList contacts={contacts} />
    </>
  );
};
