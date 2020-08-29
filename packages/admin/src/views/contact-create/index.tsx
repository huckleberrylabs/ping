import { isLeft } from "fp-ts/lib/Either";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { contactService } from "../../services";
import {
  PhoneWithCountry,
  PersonName,
  NonEmptyString,
} from "@huckleberrylabs/ping-core";

// UI
import { PhoneCountryField } from "../../components/phone-country-field";
import { Modal } from "../../components/modal";
import { Button } from "@rmwc/button";
import "@rmwc/button/styles";
import { TextField } from "@rmwc/textfield";
import "@rmwc/textfield/styles";
import "./style.css";

export const ContactCreate = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [phone, setPhone] = useState<PhoneWithCountry.T>();
  const [name, setName] = useState<NonEmptyString.T>();
  return (
    <>
      <Button onClick={() => setOpen(true)}>New Contact</Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="create-contact-modal">
          <div>
            <h3>Create Contact</h3>
            <PhoneCountryField
              onSelect={setPhone}
              showSelectedLabel={false}
              required
            />
            <TextField
              outlined
              label="name"
              value={name}
              onChange={(event) => {
                const value = (event.target as HTMLInputElement).value;
                if (NonEmptyString.Is(value)) {
                  setName(value);
                }
              }}
            />
          </div>
          <div className="create-contact-modal-buttons">
            <Button onClick={() => setOpen(false)} danger>
              Cancel
            </Button>
            <Button
              disabled={!PhoneWithCountry.Is(phone)}
              onClick={async () => {
                if (!PhoneWithCountry.Is(phone)) {
                  toast.warn("a phone number must be provided");
                  return;
                }

                const result = await contactService.create(
                  phone,
                  NonEmptyString.Is(name) ? PersonName.C(name) : undefined
                );
                if (isLeft(result)) {
                  toast.error(result.left.userMessage);
                } else {
                  toast.success("Contact created successfully.");
                  setOpen(false);
                }
              }}
            >
              Create
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
