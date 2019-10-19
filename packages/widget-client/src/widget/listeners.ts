import { pipe } from "fp-ts/lib/pipeable";
import { map, mapLeft } from "fp-ts/lib/Either";
import { Phone, NonEmptyString, PersonName, UUID } from "@huckleberryai/core";
import { SDK } from "@huckleberryai/widget";
import { Elements } from "./elements";

let message: UUID.T;

export const onCreateMessage = (
  e: Elements,
  sdk: ReturnType<typeof SDK>
) => async () => {
  e.container.style.width = "37rem";
  e.create.classList.remove("shown");
  e.addText.classList.add("shown");
  e.textInput.classList.add("shown");
  e.textInput.focus();
  message = await sdk.Message.Create();
};

export const onAddTextToMessage = (
  e: Elements,
  sdk: ReturnType<typeof SDK>
) => async () =>
  pipe(
    NonEmptyString.Codec.decode(e.textInput.value),
    mapLeft(() => {
      e.textInput.setCustomValidity("Invalid");
    }),
    map(text => {
      e.container.style.width = "23rem";
      e.addText.classList.remove("shown");
      e.textInput.classList.remove("shown");
      e.phoneInput.classList.add("shown");
      e.addPhone.classList.add("shown");
      e.phoneInput.focus();
      sdk.Message.AddText(message, text.trim());
    })
  );

export const onAddPhoneToMessage = (
  e: Elements,
  sdk: ReturnType<typeof SDK>
) => async () =>
  pipe(
    Phone.C(e.phoneInput.value),
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
      sdk.Message.AddPhone(message, phone);
    })
  );

export const onAddNameToMessageAndSend = (
  e: Elements,
  sdk: ReturnType<typeof SDK>
) => async () =>
  pipe(
    PersonName.C(e.nameInput.value),
    mapLeft(() => {
      e.nameInput.setCustomValidity("Invalid");
    }),
    map(name => {
      e.nameInput.classList.remove("shown");
      e.send.classList.remove("shown");
      e.container.style.width = "";
      e.loader.classList.add("shown");
      return sdk.Message.AddName(message, name);
    }),
    map(() => {
      return sdk.Message.Send(message);
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

export const AddEventListeners = (e: Elements, sdk: ReturnType<typeof SDK>) => {
  e.create.addEventListener("click", onCreateMessage(e, sdk));
  e.textInput.addEventListener("keyup", nextOnEnter(e.addText));
  e.addText.addEventListener("click", onAddTextToMessage(e, sdk));
  e.phoneInput.addEventListener("keyup", nextOnEnter(e.addPhone));
  e.addPhone.addEventListener("click", onAddPhoneToMessage(e, sdk));
  e.nameInput.addEventListener("keyup", nextOnEnter(e.send));
  e.send.addEventListener("click", onAddNameToMessageAndSend(e, sdk));
};
