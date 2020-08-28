import { toNullable } from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/pipeable";
import { left, right } from "fp-ts/lib/Either";
import { UUID } from "@huckleberrylabs/ping-core";
import { GetElementById } from "./helpers";

export type ElementIDs = {
  container: string;
  form: string;
  cancel: string;

  create: string;
  createIcon: string;

  textInput: string;
  addText: string;

  phoneInput: string;
  addPhone: string;

  nameInput: string;
  send: string;

  loader: string;
  success: string;
  error: string;
};

export type Elements = {
  container: HTMLDivElement;
  form: HTMLFormElement;
  cancel: HTMLButtonElement;

  create: HTMLButtonElement;
  textInput: HTMLInputElement;
  addText: HTMLButtonElement;

  phoneInput: HTMLInputElement;
  addPhone: HTMLButtonElement;

  nameInput: HTMLInputElement;
  send: HTMLButtonElement;

  loader: HTMLImageElement;
  success: HTMLImageElement;
  error: HTMLImageElement;
};

export const ElementIDs = (): ElementIDs => ({
  container: `container-${UUID.C()}`,
  form: `form-${UUID.C()}`,
  cancel: `cancel-button-${UUID.C()}`,
  create: `create-button-${UUID.C()}`,
  createIcon: `open-button-icon-${UUID.C()}`,
  textInput: `text-input-${UUID.C()}`,
  addText: `add-text-${UUID.C()}`,
  phoneInput: `phone-input-${UUID.C()}`,
  addPhone: `add-phone-${UUID.C()}`,
  nameInput: `name-input-${UUID.C()}`,
  send: `send-button-${UUID.C()}`,
  loader: `loader-${UUID.C()}`,
  success: `success-${UUID.C()}`,
  error: `error-${UUID.C()}`,
});

export const Elements = (i: ElementIDs) =>
  pipe(
    {
      container: toNullable(GetElementById(i.container)),
      form: toNullable(GetElementById(i.form)),
      cancel: toNullable(GetElementById(i.cancel)),

      create: toNullable(GetElementById(i.create)),
      textInput: toNullable(GetElementById(i.textInput)),
      addText: toNullable(GetElementById(i.addText)),

      phoneInput: toNullable(GetElementById(i.phoneInput)),
      addPhone: toNullable(GetElementById(i.addPhone)),

      nameInput: toNullable(GetElementById(i.nameInput)),
      send: toNullable(GetElementById(i.send)),

      loader: toNullable(GetElementById(i.loader)),
      success: toNullable(GetElementById(i.success)),
      error: toNullable(GetElementById(i.error)),
    },
    elems =>
      Object.values(elems).every(elems => elems !== null)
        ? right(elems as Elements)
        : left(new Error("html not initialized"))
  );
