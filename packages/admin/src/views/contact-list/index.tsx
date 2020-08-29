import React from "react";
import { toast } from "react-toastify";
import { useObservable } from "../../observable";
import { contactService, ContactStates } from "../../services";
import { Errors } from "@huckleberrylabs/ping-core";

// UI
import { ErrorButton } from "../../components/error-button";
import { Loading } from "../../components/loading";
import { ContactList } from "../../components/contact-list";

export const Contacts = () => {
  const state = useObservable(contactService.state);
  const map = useObservable(contactService.map);
  if (state === ContactStates.IDLE)
    return (
      <>
        <h1>Contacts</h1>
        <ContactList
          contacts={Array.from(map.entries()).map(([id, contact]) => contact)}
        />
      </>
    );
  if (state === ContactStates.UNINITIALIZED) contactService.getByAccount();
  if (Errors.Is(state)) {
    toast.error(state.userMessage);
    return <ErrorButton />;
  }
  // ContactStates.LOADING
  return <Loading />;
};
