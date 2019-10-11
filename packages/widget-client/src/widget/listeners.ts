import { pipe } from "fp-ts/lib/pipeable";
import { map, mapLeft } from "fp-ts/lib/Either";
import {
  UUID,
  Phone,
  NonEmptyStringCodec,
  PersonName,
} from "@huckleberryai/core";
import { WidgetSDK } from "@huckleberryai/widget";
import { Elements } from "./elements";

export const onCreateMessage = (e: Elements) => (
  widget: UUID.T,
  corr: UUID.T,
  parent?: UUID.T
) => async () => {
  e.container.style.width = "37rem";
  e.create.classList.remove("shown");
  e.addText.classList.add("shown");
  e.textInput.classList.add("shown");
  e.textInput.focus();
  WidgetSDK.Message.Create(widget, corr, parent);
};

export const onAddTextToMessage = (e: Elements) => (
  widget: UUID.T,
  corr: UUID.T,
  parent?: UUID.T
) => async () =>
  pipe(
    NonEmptyStringCodec.decode(e.textInput.value),
    mapLeft(() => {
      e.textInput.setCustomValidity("Invalid");
    }),
    map(message => {
      e.container.style.width = "23rem";
      e.addText.classList.remove("shown");
      e.textInput.classList.remove("shown");
      e.phoneInput.classList.add("shown");
      e.addPhone.classList.add("shown");
      e.phoneInput.focus();
      WidgetSDK.Message.AddText(message.trim(), widget, corr, parent);
    })
  );

export const onAddPhoneToMessage = (e: Elements) => (
  widget: UUID.T,
  corr: UUID.T,
  parent?: UUID.T
) => async () =>
  pipe(
    Phone(e.phoneInput.value),
    mapLeft(() => {
      e.phoneInput.setCustomValidity("Invalid");
    }),
    map(phone => {
      e.container.style.width = "27rem";
      e.addPhone.classList.remove("shown");
      e.phoneInput.classList.remove("shown");
      e.nameInput.classList.add("shown");
      e.send.classList.add("shown");
      e.nameInput.focus();
      WidgetSDK.Message.AddPhone(phone, widget, corr, parent);
    })
  );

export const onAddNameToMessageAndSend = (e: Elements) => (
  widget: UUID.T,
  corr: UUID.T,
  parent?: UUID.T
) => async () =>
  pipe(
    PersonName(e.nameInput.value),
    mapLeft(() => {
      e.nameInput.setCustomValidity("Invalid");
    }),
    map(name => {
      e.nameInput.classList.remove("shown");
      e.send.classList.remove("shown");
      e.container.style.width = "";
      e.loader.classList.add("shown");
      return WidgetSDK.Message.AddName(name, widget, corr, parent);
    }),
    map(res => {
      return WidgetSDK.Message.Send(widget, corr, parent);
    }),
    mapLeft(() => {
      e.loader.classList.remove("shown");
      e.error.classList.add("shown");
    })
  );

export const nextOnEnter = (button: HTMLButtonElement) => (
  event: KeyboardEvent
) => {
  event.preventDefault();
  if (event.keyCode === 13) button.click();
};

export const AddEventListeners = (e: Elements) => (
  widget: UUID.T,
  corr: UUID.T,
  parent?: UUID.T
) => {
  e.create.addEventListener("click", onCreateMessage(e)(widget, corr, parent));
  e.textInput.addEventListener("keyup", nextOnEnter(e.addText));
  e.addText.addEventListener(
    "click",
    onAddTextToMessage(e)(widget, corr, parent)
  );
  e.phoneInput.addEventListener("keyup", nextOnEnter(e.addPhone));
  e.addPhone.addEventListener(
    "click",
    onAddPhoneToMessage(e)(widget, corr, parent)
  );
  e.nameInput.addEventListener("keyup", nextOnEnter(e.send));
  e.send.addEventListener(
    "click",
    onAddNameToMessageAndSend(e)(widget, corr, parent)
  );
};
