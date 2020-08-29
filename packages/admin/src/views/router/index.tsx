import React, { useState } from "react";
import { isSome } from "fp-ts/lib/Option";
import { useObservable } from "../../observable";
import { toast } from "react-toastify";
import {
  UUID,
  Messaging,
  Errors,
  PersonName,
} from "@huckleberrylabs/ping-core";
import {
  contactService,
  ContactStates,
  routerService,
  RouterStates,
} from "../../services";
import { ContactCreate } from "../contact-create";
import { ErrorButton } from "../../components/error-button";
import { Loading } from "../../components/loading";
import { ForwardButton } from "../../components/forward-button";
import { Select } from "@rmwc/select";
import "@rmwc/select/styles";
import "./style.css";

type Props = { channel: UUID.T };

type FormProps = {
  contact: UUID.T | undefined;
  contacts: Messaging.Contact.Model.T[];
  onSubmit: (value: UUID.T) => void;
};
const Form = (props: FormProps) => {
  const [modified, setModified] = useState(false);
  const [selected, setSelected] = useState(props.contact);
  return (
    <div className="router-form">
      <Select
        enhanced
        value={selected}
        options={props.contacts.map((contact) => ({
          label: `${
            isSome(contact.name)
              ? `${PersonName.FirstLast(contact.name.value)} `
              : ""
          }${contact.phone.number}`,
          value: contact.id,
        }))}
        onChange={(event) => {
          const value = (event.target as HTMLInputElement).value as UUID.T;
          setModified(value !== props.contact || modified);
          setSelected(value);
        }}
      />
      <ContactCreate />
      <ForwardButton
        label={"save"}
        icon={"keyboard_arrow_right"}
        disabled={!modified}
        onClick={() => {
          if (UUID.Is(selected)) props.onSubmit(selected);
        }}
      />
    </div>
  );
};

export const Router = (props: Props) => {
  const routerState = useObservable(routerService.state);
  const contacts = useObservable(contactService.map);
  const contactState = useObservable(contactService.state);
  if (Messaging.Router.Model.Is(routerState)) {
    if (contactState === ContactStates.UNINITIALIZED)
      contactService.getByAccount();
    // @ts-ignore
    const contactID = routerState.routes[props.channel];
    const contactsArray = Array.from(contacts.values()).filter(
      (contact) => contact.internal
    );
    return (
      <div className="router">
        <Form
          contact={contactID}
          contacts={contactsArray}
          onSubmit={(id) => {
            const router = routerState;
            // @ts-ignore
            router.routes[props.channel] = id;
            routerService.update(
              Messaging.Router.UseCases.Update.Command.C(router)
            );
          }}
        />
      </div>
    );
  }
  if (routerState === RouterStates.UNINITIALIZED) routerService.get();
  if (Errors.Is(routerState)) {
    toast.error(routerState.userMessage);
    return <ErrorButton />;
  }
  if (Errors.Is(contactState)) {
    toast.error(contactState.userMessage);
    return <ErrorButton />;
  }
  return <Loading />;
};
