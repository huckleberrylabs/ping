import {
  UUID,
  IsNonEmptyString,
  IsPhone,
  IsValidNameString,
  ParsePersonName,
  IPostEvent,
  IBeaconEvent,
} from "@huckleberryai/core";
import {
  WidgetCreateMessageCommand,
  WidgetAddTextToMessageCommand,
  WidgetAddPhoneToMessageCommand,
  WidgetAddNameToMessageCommand,
  WidgetSendMessageCommand,
} from "@huckleberryai/widget";
import { IWidgetClientElements } from "./elements";
import { WebAnalyticsClientUnloadedEvent } from "@huckleberryai/web-analytics";

export const onCreateTextMessage = (post: IPostEvent) => (
  e: IWidgetClientElements
) => (
  widget: UUID,
  corr: UUID,
  parent: UUID,
  agent: UUID | undefined
) => async () => {
  const ORIGIN_ID = "066548fe-cc82-475c-82d9-9bacfbf39104";
  e.container.style.width = "37rem";
  e.create.classList.remove("shown");
  e.addText.classList.add("shown");
  e.textInput.classList.add("shown");
  e.textInput.focus();
  post(WidgetCreateMessageCommand(widget, ORIGIN_ID, corr, parent, agent));
};

export const onAddTextToMessage = (post: IPostEvent) => (
  e: IWidgetClientElements
) => (
  widget: UUID,
  corr: UUID,
  parent: UUID,
  agent: UUID | undefined
) => async () => {
  const ORIGIN_ID = "ccaeae68-b431-4fd0-95c5-d13abeb12cb7";
  const message = e.textInput.value;
  if (!IsNonEmptyString(message)) {
    e.textInput.setCustomValidity("Invalid");
    return;
  }
  e.container.style.width = "23rem";
  e.addText.classList.remove("shown");
  e.textInput.classList.remove("shown");
  e.phoneInput.classList.add("shown");
  e.addPhone.classList.add("shown");
  e.phoneInput.focus();
  post(
    WidgetAddTextToMessageCommand(
      message.trim(),
      widget,
      ORIGIN_ID,
      corr,
      parent,
      agent
    )
  );
};

export const onAddPhoneToMessage = (post: IPostEvent) => (
  e: IWidgetClientElements
) => (
  widget: UUID,
  corr: UUID,
  parent: UUID,
  agent: UUID | undefined
) => async () => {
  const ORIGIN_ID = "d868878e-e438-474f-95ff-654536e665d9";
  const phone = e.phoneInput.value;
  if (!IsPhone(phone)) {
    e.phoneInput.setCustomValidity("Invalid");
    return;
  }
  e.container.style.width = "27rem";
  e.addPhone.classList.remove("shown");
  e.phoneInput.classList.remove("shown");
  e.nameInput.classList.add("shown");
  e.send.classList.add("shown");
  e.nameInput.focus();
  post(
    WidgetAddPhoneToMessageCommand(
      phone,
      widget,
      ORIGIN_ID,
      corr,
      parent,
      agent
    )
  );
};

export const onAddNameToMessageAndSend = (post: IPostEvent) => (
  e: IWidgetClientElements
) => (
  widget: UUID,
  corr: UUID,
  parent: UUID,
  agent: UUID | undefined
) => async () => {
  const ORIGIN_ID = "67a2a42b-2a4b-47e9-9550-6395cba39ff0";
  const personNameString = e.nameInput.value;
  if (!IsValidNameString(personNameString)) {
    e.nameInput.setCustomValidity("Invalid");
    return;
  }
  const personName = ParsePersonName(personNameString);
  e.nameInput.classList.remove("shown");
  e.send.classList.remove("shown");
  e.container.style.width = "";
  e.loader.classList.add("shown");
  try {
    await post(
      WidgetAddNameToMessageCommand(
        personName,
        widget,
        ORIGIN_ID,
        corr,
        parent,
        agent
      )
    );
    await post(
      WidgetSendMessageCommand(widget, ORIGIN_ID, corr, parent, agent)
    );
    e.loader.classList.remove("shown");
    e.success.classList.add("shown");
  } catch (error) {
    e.loader.classList.remove("shown");
    e.error.classList.add("shown");
  }
};

export const onUnloadEvent = (beacon: IBeaconEvent) => (
  widget: UUID | null,
  corr: UUID,
  parent: UUID,
  agent: UUID | undefined
) => async () => {
  const ORIGIN_ID = "28d540c0-a781-47db-870c-fac3ad9a3d6b";
  beaconEvent(
    WebAnalyticsClientUnloadedEvent(
      LOG,
      null,
      widget,
      ORIGIN_ID,
      corr,
      parent,
      agent
    )
  );
};

export const nextOnEnter = (button: HTMLButtonElement) => (
  event: KeyboardEvent
) => {
  event.preventDefault();
  if (event.keyCode === 13) button.click();
};

export const addEventListeners = (post: IPostEvent) => (
  e: IWidgetClientElements
) => (widget: UUID, corr: UUID, parent: UUID, agent: UUID | undefined) => {
  e.create.addEventListener(
    "click",
    onCreateTextMessage(post)(e)(widget, corr, parent, agent)
  );

  e.textInput.addEventListener("keyup", nextOnEnter(e.addText));
  e.addText.addEventListener(
    "click",
    onAddTextToMessage(post)(e)(widget, corr, parent, agent)
  );

  e.phoneInput.addEventListener("keyup", nextOnEnter(e.addPhone));
  e.addPhone.addEventListener(
    "click",
    onAddPhoneToMessage(post)(e)(widget, corr, parent, agent)
  );

  e.nameInput.addEventListener("keyup", nextOnEnter(e.send));
  e.send.addEventListener(
    "click",
    onAddNameToMessageAndSend(post)(e)(widget, corr, parent, agent)
  );
};
