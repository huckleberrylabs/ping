import { UUID } from "@huckleberryai/core";
import { getElementById } from "./helpers";

export type IWidgetClientElementIDs = {
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

export type IWidgetClientElements = {
  container: HTMLDivElement;
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

export const INSERT_SCRIPT_ID = "huckleberry-text-insert-script";

export const WidgetClientElementIDs = (): IWidgetClientElementIDs => ({
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

// Load Elements
export const GetWidgetClientElementsFromIDs = (
  i: IWidgetClientElementIDs
): IWidgetClientElements => ({
  container: <HTMLDivElement>getElementById(i.container),
  create: <HTMLButtonElement>getElementById(i.create),
  textInput: <HTMLInputElement>getElementById(i.textInput),
  addText: <HTMLButtonElement>getElementById(i.addText),
  phoneInput: <HTMLInputElement>getElementById(i.phoneInput),
  addPhone: <HTMLButtonElement>getElementById(i.addPhone),
  nameInput: <HTMLInputElement>getElementById(i.nameInput),
  send: <HTMLButtonElement>getElementById(i.send),
  loader: <HTMLImageElement>getElementById(i.loader),
  success: <HTMLImageElement>getElementById(i.success),
  error: <HTMLImageElement>getElementById(i.error),
});
