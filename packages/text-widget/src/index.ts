import { ID } from "@huckleberryai/core";
import {
  TextWidgetSettingsQuery,
  TextWidgetLoadedEvent,
  TextWidgetSettings,
  TextWidgetOpenedCommand,
  TextWidgetMessageAddedCommand,
  TextWidgetPhoneAddedCommand,
  TextWidgetNameAddedCommand,
  TextWidgetSentCommand,
  validateString,
  normalizePhone,
  validatePhone,
} from "@huckleberryai/text";
import {
  CSS_ID,
  INSERT_SCRIPT_ID,
  CONTAINER_ID,
  OPEN_BUTON_ID,
  MESSAGE_INPUT_ID,
  MESSAGE_BUTTON_ID,
  PHONE_INPUT_ID,
  PHONE_BUTTON_ID,
  NAME_INPUT_ID,
  SEND_BUTTON_ID,
  SUCCESS_ID,
  ERROR_ID,
  LOADER_ID,
} from "./element-ids";
import { log, getElementById } from "./helpers";
import { postEvent } from "./api";
import { generateCSS } from "./css";
import { generateHTML } from "./html";

async function HuckleberryTextWidget() {
  log(`Script Loaded`);
  // SET CONSTANTS
  const ORIGIN_ID = new ID("02553494-2ee2-43fb-b7e5-826ea0281883");
  const AGENT_ID = new ID();
  const CORR_ID = new ID();

  // GET WIDGET ID
  const WIDGET_ID = ((): ID => {
    const script = getElementById(INSERT_SCRIPT_ID);
    const urlString = script.getAttribute("src");
    if (!urlString) {
      throw new Error("script src attribute missing");
    }
    const a = document.createElement("a");
    a.href = urlString;
    const url = new URL(a.href);
    const id = url.searchParams.get("widget_id");
    if (!id) {
      throw new Error("Widget ID Must Be Provided");
    }
    return new ID(id);
  })();
  log(`WIDGET ID Retrieved: ${WIDGET_ID} `);

  // POST WIDGET LOADED EVENT
  const textWidgetLoadedEvent = new TextWidgetLoadedEvent(
    WIDGET_ID,
    ORIGIN_ID,
    CORR_ID
  );
  postEvent(textWidgetLoadedEvent);
  log(`TextWidgetLoadedEvent Posted`);

  // GET WIDGET SETTINGS
  const textWidgetSettings = await (async (): Promise<TextWidgetSettings> => {
    const textWidgetSettingsQuery = new TextWidgetSettingsQuery(
      WIDGET_ID,
      AGENT_ID,
      ORIGIN_ID,
      CORR_ID,
      textWidgetLoadedEvent.id
    );
    const result = await postEvent(textWidgetSettingsQuery);
    if (!result) {
      throw new Error(`No Result provided`);
    }
    return TextWidgetSettings.fromJSON(result.data);
  })();
  log(`Settings Retrieved`);

  // CHECK IF WIDGET IS ENABLED
  if (!textWidgetSettings.enabled) {
    log("Widget Disabled");
    return;
  }

  // INSERT CSS
  (() => {
    if (!document.getElementById(CSS_ID)) {
      const style = document.createElement("style");
      style.id = CSS_ID;
      style.type = "text/css";
      style.innerHTML = generateCSS(
        textWidgetSettings.mainColor,
        textWidgetSettings.accentColor
      );
      const head = document.getElementsByTagName("head")[0];
      head.appendChild(style);
    }
  })();
  log(`CSS inserted`);

  // INSERT HTML
  (() => {
    const div = document.createElement("div");
    div.innerHTML = generateHTML();
    document.getElementsByTagName("body")[0].appendChild(div);
  })();
  log(`HTML inserted`);

  // SET ELEMENTS
  const container = <HTMLDivElement>getElementById(CONTAINER_ID);
  const openButton = <HTMLButtonElement>getElementById(OPEN_BUTON_ID);
  const messageInput = <HTMLInputElement>getElementById(MESSAGE_INPUT_ID);
  const messageButton = <HTMLButtonElement>getElementById(MESSAGE_BUTTON_ID);
  const phoneInput = <HTMLInputElement>getElementById(PHONE_INPUT_ID);
  const phoneButton = <HTMLButtonElement>getElementById(PHONE_BUTTON_ID);
  const nameInput = <HTMLInputElement>getElementById(NAME_INPUT_ID);
  const sendButton = <HTMLButtonElement>getElementById(SEND_BUTTON_ID);

  const loaderMessage = <HTMLImageElement>getElementById(LOADER_ID);
  const successMessage = <HTMLImageElement>getElementById(SUCCESS_ID);
  const errorMessage = <HTMLImageElement>getElementById(ERROR_ID);

  log(`Elements Found`);

  async function onOpenedEvent(): Promise<void> {
    const ORIGIN_ID = new ID("066548fe-cc82-475c-82d9-9bacfbf39104");
    container.style.width = "37rem";
    openButton.classList.remove("shown");
    messageButton.classList.add("shown");
    messageInput.classList.add("shown");
    messageInput.focus();
    const command = new TextWidgetOpenedCommand(
      WIDGET_ID,
      AGENT_ID,
      ORIGIN_ID,
      CORR_ID,
      textWidgetLoadedEvent.id
    );
    await postEvent(command);
    log("Open Event Posted");
  }
  openButton.addEventListener("click", onOpenedEvent);

  async function onMessageAddedEvent() {
    const ORIGIN_ID = new ID("ccaeae68-b431-4fd0-95c5-d13abeb12cb7");
    const messageString = messageInput.value;
    if (messageString && validateString(messageString)) {
      container.style.width = "23rem";
      messageButton.classList.remove("shown");
      messageInput.classList.remove("shown");
      phoneInput.classList.add("shown");
      phoneButton.classList.add("shown");
      phoneInput.focus();
      const message = messageString.trim();
      const command = new TextWidgetMessageAddedCommand(
        message.trim(),
        WIDGET_ID,
        AGENT_ID,
        ORIGIN_ID,
        CORR_ID,
        textWidgetLoadedEvent.id
      );
      await postEvent(command);
      log("Message Added Event Posted");
    } else {
      messageInput.setCustomValidity("Invalid");
    }
  }
  messageButton.addEventListener("click", onMessageAddedEvent);

  async function onPhoneAddedEvent() {
    const ORIGIN_ID = new ID("d868878e-e438-474f-95ff-654536e665d9");
    const phoneString = phoneInput.value;
    if (validatePhone(phoneString)) {
      container.style.width = "27rem";
      phoneButton.classList.remove("shown");
      phoneInput.classList.remove("shown");
      nameInput.classList.add("shown");
      sendButton.classList.add("shown");
      nameInput.focus();
      const phone = normalizePhone(phoneString);
      if (phone) {
        const command = new TextWidgetPhoneAddedCommand(
          phone,
          WIDGET_ID,
          AGENT_ID,
          ORIGIN_ID,
          CORR_ID,
          textWidgetLoadedEvent.id
        );
        await postEvent(command);
        log("Phone Added Event Posted");
      }
    } else {
      phoneInput.setCustomValidity("Invalid");
    }
  }
  phoneButton.addEventListener("click", onPhoneAddedEvent);

  async function onNameAddedAndSentEvent() {
    const ORIGIN_ID = new ID("67a2a42b-2a4b-47e9-9550-6395cba39ff0");
    const name = nameInput.value;
    const message = messageInput.value;
    const phone = phoneInput.value;
    if (
      name &&
      validateString(name) &&
      message &&
      validateString(message) &&
      phone &&
      validatePhone(phone)
    ) {
      nameInput.classList.remove("shown");
      sendButton.classList.remove("shown");
      loaderMessage.classList.add("shown");
      container.style.width = "";
      const nameAddedCommand = new TextWidgetNameAddedCommand(
        name.trim(),
        WIDGET_ID,
        AGENT_ID,
        ORIGIN_ID,
        CORR_ID,
        textWidgetLoadedEvent.id
      );
      const sentCommand = new TextWidgetSentCommand(
        WIDGET_ID,
        AGENT_ID,
        ORIGIN_ID,
        CORR_ID,
        textWidgetLoadedEvent.id
      );

      try {
        await postEvent(nameAddedCommand);
        await postEvent(sentCommand);
        log("Name Added and Sent Events Posted");
        loaderMessage.classList.remove("shown");
        successMessage.classList.add("shown");
      } catch (error) {
        loaderMessage.classList.remove("shown");
        errorMessage.classList.add("shown");
      }
    } else {
      nameInput.setCustomValidity("Invalid");
    }
  }
  sendButton.addEventListener("click", onNameAddedAndSentEvent);

  messageInput.addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
      messageButton.click();
    }
  });

  phoneInput.addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
      phoneButton.click();
    }
  });

  nameInput.addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
      sendButton.click();
    }
  });

  log(`Event Listeners Loaded`);
  log(`Initialized Successfully`);
}

window.addEventListener("load", HuckleberryTextWidget, false);
