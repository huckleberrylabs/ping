import { toNullable } from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/pipeable";
import { left, right } from "fp-ts/lib/Either";
import { UUID } from "@huckleberryai/core";
import { GetElementById } from "./helpers";

export type ElementIDs = {
  container: string;
  form: string;

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
  container: `container-${UUID()}`,
  form: `form-${UUID()}`,
  create: `create-button-${UUID()}`,
  createIcon: `open-button-icon-${UUID()}`,
  textInput: `text-input-${UUID()}`,
  addText: `add-text-${UUID()}`,
  phoneInput: `phone-input-${UUID()}`,
  addPhone: `add-phone-${UUID()}`,
  nameInput: `name-input-${UUID()}`,
  send: `send-button-${UUID()}`,
  loader: `loader-${UUID()}`,
  success: `success-${UUID()}`,
  error: `error-${UUID()}`,
});

export const Elements = (i: ElementIDs) =>
  pipe(
    {
      container: toNullable(GetElementById(i.container)),
      form: toNullable(GetElementById(i.form)),

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
