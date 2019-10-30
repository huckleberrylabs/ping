import { isLeft, isRight } from "fp-ts/lib/Either";
import { UUID, NonEmptyString, Phone, PersonName } from "@huckleberryai/core";
import { Interfaces } from "@huckleberryai/ping";
import { Elements } from "./elements";

let message: UUID.T;

export const onCreateMessage = (
  e: Elements,
  sdk: Interfaces.PublicSDK
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
  sdk: Interfaces.PublicSDK
) => async () => {
  const textMaybe = NonEmptyString.Codec.decode(e.textInput.value.trim());
  if (isLeft(textMaybe)) {
    e.textInput.setCustomValidity("Invalid");
    return;
  }
  const text = textMaybe.right;
  e.container.style.width = "23rem";
  e.addText.classList.remove("shown");
  e.textInput.classList.remove("shown");
  e.phoneInput.classList.add("shown");
  e.addPhone.classList.add("shown");
  e.phoneInput.focus();
  sdk.Message.AddText(message, text);
};

export const onAddPhoneToMessage = (
  e: Elements,
  sdk: Interfaces.PublicSDK
) => async () => {
  const phoneMaybe = Phone.C(e.phoneInput.value);
  if (isLeft(phoneMaybe)) {
    e.phoneInput.setCustomValidity("Invalid");
    return;
  }
  const phone = phoneMaybe.right;
  e.container.style.width = "27rem";
  e.addPhone.classList.remove("shown");
  e.phoneInput.classList.remove("shown");
  e.nameInput.classList.add("shown");
  e.send.classList.add("shown");
  e.nameInput.focus();
  sdk.Message.AddPhone(message, phone);
};

export const onAddNameToMessageAndSend = (
  e: Elements,
  sdk: Interfaces.PublicSDK
) => async () => {
  const value = e.nameInput.value.trim();
  if (!NonEmptyString.Is(value)) {
    e.nameInput.setCustomValidity("Invalid");
    return;
  }
  const name = PersonName.C(value);
  e.nameInput.classList.remove("shown");
  e.send.classList.remove("shown");
  e.container.style.width = "";
  e.loader.classList.add("shown");
  await sdk.Message.AddName(message, name);
  const res = await sdk.Message.Send(message);
  e.loader.classList.remove("shown");
  if (isRight(res)) {
    e.success.classList.add("shown");
  } else {
    e.error.classList.add("shown");
  }
};

export const nextOnEnter = (button: HTMLButtonElement) => (
  event: KeyboardEvent
) => {
  event.preventDefault();
  if (event.keyCode === 13) button.click();
};

export const AddEventListeners = (e: Elements, sdk: Interfaces.PublicSDK) => {
  e.create.addEventListener("click", onCreateMessage(e, sdk));
  e.textInput.addEventListener("keyup", nextOnEnter(e.addText));
  e.addText.addEventListener("click", onAddTextToMessage(e, sdk));
  e.phoneInput.addEventListener("keyup", nextOnEnter(e.addPhone));
  e.addPhone.addEventListener("click", onAddPhoneToMessage(e, sdk));
  e.nameInput.addEventListener("keyup", nextOnEnter(e.send));
  e.send.addEventListener("click", onAddNameToMessageAndSend(e, sdk));
};
