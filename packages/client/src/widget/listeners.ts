import { isLeft, isRight } from "fp-ts/lib/Either";
import {
  UUID,
  NonEmptyString,
  Phone,
  PersonName,
  Widget,
  TimeStamp,
} from "@huckleberrylabs/ping-core";
import { Elements } from "./elements";
import * as SDK from "../sdk";

const message: Partial<Widget.Message.T> = {
  id: UUID.C(),
  timestamp: TimeStamp.C(),
};

export const onOpen = (e: Elements, sdk: SDK.T) => async () => {
  e.container.style.width = "37rem";
  e.create.classList.remove("shown");
  e.addText.classList.add("shown");
  e.textInput.classList.add("shown");
  e.textInput.focus();
  sdk.Analytics.Open();
};

export const onAddText = (e: Elements, sdk: SDK.T) => async () => {
  const textMaybe = NonEmptyString.Codec.decode(e.textInput.value.trim());
  if (isLeft(textMaybe)) {
    e.textInput.setCustomValidity("Invalid");
    return;
  }
  message.text = textMaybe.right;
  e.container.style.width = "23rem";
  e.addText.classList.remove("shown");
  e.textInput.classList.remove("shown");
  e.phoneInput.classList.add("shown");
  e.addPhone.classList.add("shown");
  e.phoneInput.focus();
  const addTextFieldID = "c1a4cb97-63bc-4f80-b913-5fa6fe1db013" as UUID.T;
  sdk.Analytics.AddField(addTextFieldID);
};

export const onAddPhone = (
  e: Elements,
  w: Widget.PublicModel.T,
  sdk: SDK.T
) => async () => {
  const phoneMaybe = Phone.C(e.phoneInput.value, w.countryCode);
  if (isLeft(phoneMaybe)) {
    e.phoneInput.setCustomValidity("Invalid");
    return;
  }
  message.phone = phoneMaybe.right;
  e.container.style.width = "27rem";
  e.addPhone.classList.remove("shown");
  e.phoneInput.classList.remove("shown");
  e.nameInput.classList.add("shown");
  e.send.classList.add("shown");
  e.nameInput.focus();
  const addPhoneFieldID = "d9a6feda-06fb-413c-b161-82a6bca486ac" as UUID.T;
  sdk.Analytics.AddField(addPhoneFieldID);
};

export const onAddNameAndSend = (
  e: Elements,
  w: Widget.PublicModel.T,
  sdk: SDK.T
) => async () => {
  const value = e.nameInput.value.trim();
  if (!NonEmptyString.Is(value)) {
    e.nameInput.setCustomValidity("Invalid");
    return;
  }
  message.name = PersonName.C(value);
  e.nameInput.classList.remove("shown");
  e.send.classList.remove("shown");
  e.container.style.width = "";
  e.loader.classList.add("shown");
  const addNameFieldID = "179b3014-4b93-40e6-beb9-5153ddf8e3af" as UUID.T;
  sdk.Analytics.AddField(addNameFieldID);
  const res = await sdk.Widget.Transmit(message);
  e.loader.classList.remove("shown");
  if (isRight(res)) {
    if (w.liveChat) {
      // TODO
    }
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

export const AddEventListeners = (
  e: Elements,
  w: Widget.PublicModel.T,
  sdk: SDK.T
) => {
  e.create.addEventListener("click", onOpen(e, sdk));
  e.textInput.addEventListener("keyup", nextOnEnter(e.addText));
  e.addText.addEventListener("click", onAddText(e, sdk));
  e.phoneInput.addEventListener("keyup", nextOnEnter(e.addPhone));
  e.addPhone.addEventListener("click", onAddPhone(e, w, sdk));
  e.nameInput.addEventListener("keyup", nextOnEnter(e.send));
  e.send.addEventListener("click", onAddNameAndSend(e, w, sdk));
};
