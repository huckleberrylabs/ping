import { ID, Log } from "@huckleberryai/core";
import {
  TextWidgetSettingsQuery,
  TextWidgetLoadedEvent,
  TextWidgetUnloadedEvent,
  TextWidgetSettings,
  TextWidgetOpenedCommand,
  TextWidgetMessageAddedCommand,
  TextWidgetPhoneAddedCommand,
  TextWidgetNameAddedCommand,
  TextWidgetSentCommand,
  validateString,
  normalizePhone,
  validatePhone,
  API_ENDPOINT,
  EVENTS_ENDPOINT,
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
import { getElementById } from "./helpers";
import { postEvent, beaconEvent } from "./api";
import { generateCSS } from "./css";
import { generateHTML } from "./html";

async function HuckleberryTextWidget() {
  // Send Log on page close
  async function onUnloadEvent() {
    const ORIGIN_ID = new ID("28d540c0-a781-47db-870c-fac3ad9a3d6b");
    let widgetID = undefined;
    try {
      // WIDGET_ID might not be defined, giving a Reference Error;
      widgetID = WIDGET_ID;
    } catch (error) {
      // ignore, this is already logged in Retrieve Widget ID section;
    }
    beaconEvent(new TextWidgetUnloadedEvent(log, widgetID, ORIGIN_ID, CORR_ID));
  }
  window.addEventListener("unload", onUnloadEvent);

  const ORIGIN_ID = new ID("02553494-2ee2-43fb-b7e5-826ea0281883");
  const AGENT_ID = new ID();
  const CORR_ID = new ID();
  const log = new Log();

  const textWidgetLoadedEvent = new TextWidgetLoadedEvent(
    new ID(), // Chicken and Egg Problem between PARENT_ID and WIDGET_ID
    ORIGIN_ID,
    CORR_ID
  );
  const PARENT_ID = textWidgetLoadedEvent.id;
  log.add(
    `TextWidget loaded successfully`,
    ["info"],
    ORIGIN_ID,
    CORR_ID,
    PARENT_ID
  );

  // Retrieve Widget ID
  const WIDGET_ID = ((): ID => {
    try {
      const script = getElementById(INSERT_SCRIPT_ID);
      const urlString = script.getAttribute("src");
      if (!urlString) {
        throw new Error("script src attribute missing");
      }
      const a = document.createElement("a");
      a.href = urlString;
      const url = new URL(a.href);
      const idString = url.searchParams.get("widget_id");
      if (!idString) {
        throw new Error("Widget ID Must Be Provided");
      }
      const id = new ID(idString);
      log.add(
        `widgetID retrieved successfully: ${id} `,
        ["info"],
        ORIGIN_ID,
        CORR_ID,
        PARENT_ID
      );
      return id;
    } catch (error) {
      const message = "widgetID could not be retrieved";
      log.add(message, ["error"], ORIGIN_ID, CORR_ID, PARENT_ID);
      throw new Error(message);
    }
  })();

  // Widget Loaded Event
  textWidgetLoadedEvent.widgetID = WIDGET_ID;
  await postEvent(textWidgetLoadedEvent);
  log.add(
    `TextWidgetLoadedEvent posted to ${API_ENDPOINT +
      EVENTS_ENDPOINT} successfully`,
    ["info"],
    ORIGIN_ID,
    CORR_ID,
    PARENT_ID
  );

  // Retrieve Widget Settings
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
  log.add(`settings retrieved`, ["info"], ORIGIN_ID, CORR_ID, PARENT_ID);

  // CHECK IF WIDGET IS ENABLED
  if (!textWidgetSettings.enabled) {
    log.add(`widget disabled`, ["info"], ORIGIN_ID, CORR_ID, PARENT_ID);
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
  log.add(`css inserted`, ["info"], ORIGIN_ID, CORR_ID, PARENT_ID);

  // INSERT HTML
  (() => {
    const div = document.createElement("div");
    div.innerHTML = generateHTML();
    document.getElementsByTagName("body")[0].appendChild(div);
  })();
  log.add(`html inserted`, ["info"], ORIGIN_ID, CORR_ID, PARENT_ID);

  // Load Elements
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

  log.add(`elements loaded`, ["info"], ORIGIN_ID, CORR_ID, PARENT_ID);

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

  function nextOnEnter(event: KeyboardEvent, button: HTMLButtonElement) {
    event.preventDefault();
    if (event.keyCode === 13) {
      button.click();
    }
  }

  messageInput.addEventListener("keyup", event =>
    nextOnEnter(event, messageButton)
  );
  phoneInput.addEventListener("keyup", event =>
    nextOnEnter(event, phoneButton)
  );
  nameInput.addEventListener("keyup", event => nextOnEnter(event, sendButton));

  log(`Event Listeners Loaded`);
  log(`Initialized Successfully`);
}

window.addEventListener("load", HuckleberryTextWidget, false);
