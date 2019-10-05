import { IsPhone, IsPersonName, IsNonEmptyString } from "@huckleberryai/core";
import {
  IWidgetSettings,
  generateCSS,
  generateHTML,
  ELEMENT_IDS
} from "@huckleberryai/widget";
import { getElementById } from "./helpers";

export const HuckleberryTextWidget = () => {
  const widgetSettings: IWidgetSettings = {};

  // INSERT CSS
  (() => {
    if (!document.getElementById(ELEMENT_IDS.cssID)) {
      const style = document.createElement("style");
      style.id = ELEMENT_IDS.cssID;
      style.type = "text/css";
      style.innerHTML = generateCSS(ELEMENT_IDS)(
        widgetSettings.mainColor,
        widgetSettings.accentColor
      );
      const head = document.getElementsByTagName("head")[0];
      head.appendChild(style);
    }
  })();

  // INSERT HTML
  (() => {
    const div = document.createElement("div");
    div.innerHTML = generateHTML(ELEMENT_IDS);
    document.getElementsByTagName("body")[0].appendChild(div);
  })();

  // Load Elements
  const container = <HTMLDivElement>getElementById(ELEMENT_IDS.containerID);
  const openButton = <HTMLButtonElement>(
    getElementById(ELEMENT_IDS.openButtonID)
  );
  const messageInput = <HTMLInputElement>(
    getElementById(ELEMENT_IDS.messageInputID)
  );
  const messageButton = <HTMLButtonElement>(
    getElementById(ELEMENT_IDS.messageButtonID)
  );
  const phoneInput = <HTMLInputElement>getElementById(ELEMENT_IDS.phoneInputID);
  const phoneButton = <HTMLButtonElement>(
    getElementById(ELEMENT_IDS.phoneButtonID)
  );
  const nameInput = <HTMLInputElement>getElementById(ELEMENT_IDS.nameInputID);
  const sendButton = <HTMLButtonElement>(
    getElementById(ELEMENT_IDS.sendButtonID)
  );

  const loaderMessage = <HTMLImageElement>getElementById(ELEMENT_IDS.loaderID);
  const successMessage = <HTMLImageElement>(
    getElementById(ELEMENT_IDS.successID)
  );
  const errorMessage = <HTMLImageElement>getElementById(ELEMENT_IDS.errorID);

  async function onOpenedEvent(): Promise<void> {
    container.style.width = "37rem";
    openButton.classList.remove("shown");
    messageButton.classList.add("shown");
    messageInput.classList.add("shown");
    messageInput.focus();
  }
  openButton.addEventListener("click", onOpenedEvent);

  async function onMessageAddedEvent() {
    const message = messageInput.value;
    if (!IsNonEmptyString(message)) {
      messageInput.setCustomValidity("Invalid");
      return;
    }
    container.style.width = "23rem";
    messageButton.classList.remove("shown");
    messageInput.classList.remove("shown");
    phoneInput.classList.add("shown");
    phoneButton.classList.add("shown");
    phoneInput.focus();
  }
  messageButton.addEventListener("click", onMessageAddedEvent);

  async function onPhoneAddedEvent() {
    const phone = phoneInput.value;
    if (!IsPhone(phone)) {
      phoneInput.setCustomValidity("Invalid");
      return;
    }
    container.style.width = "27rem";
    phoneButton.classList.remove("shown");
    phoneInput.classList.remove("shown");
    nameInput.classList.add("shown");
    sendButton.classList.add("shown");
    nameInput.focus();
  }
  phoneButton.addEventListener("click", onPhoneAddedEvent);

  async function onNameAddedAndSentEvent() {
    const personName = nameInput.value;
    if (!IsPersonName(personName)) {
      nameInput.setCustomValidity("Invalid");
      return;
    }
    nameInput.classList.remove("shown");
    sendButton.classList.remove("shown");
    loaderMessage.classList.add("shown");
    container.style.width = "";
    try {
      loaderMessage.classList.remove("shown");
      successMessage.classList.add("shown");
    } catch (error) {
      loaderMessage.classList.remove("shown");
      errorMessage.classList.add("shown");
    }
  }
  sendButton.addEventListener("click", onNameAddedAndSentEvent);

  const nextOnEnter = (button: HTMLButtonElement) => (event: KeyboardEvent) => {
    event.preventDefault();
    if (event.keyCode === 13) {
      button.click();
    }
  };

  messageInput.addEventListener("keyup", nextOnEnter(messageButton));
  phoneInput.addEventListener("keyup", nextOnEnter(phoneButton));
  nameInput.addEventListener("keyup", nextOnEnter(sendButton));
};
