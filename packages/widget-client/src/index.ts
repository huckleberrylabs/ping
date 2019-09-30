import {
  UUID,
  IsPhone,
  IsPersonName,
  IsError,
  IsUUID,
  IsNonEmptyString,
} from "@huckleberryai/core";
import {
  TextWidgetSettingsQuery,
  ClientLoadedEvent,
  ClientUnloadedEvent,
  TextWidgetOpenedCommand,
  TextWidgetMessageAddedCommand,
  TextWidgetPhoneAddedCommand,
  TextWidgetNameAddedCommand,
  TextWidgetSentCommand,
  API_ENDPOINT,
  EVENTS_ENDPOINT,
  ITextWidgetSettings,
  IsTextWidgetSettings,
} from "@huckleberryai/widget";
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
import { log, LOG } from "./log";
import { getElementById } from "./helpers";
import { postEvent, beaconEvent } from "./api";
import { generateCSS } from "./css";
import { generateHTML } from "./html";

async function HuckleberryTextWidget() {
  // send log on page close
  async function onUnloadEvent() {
    const ORIGIN_ID = "28d540c0-a781-47db-870c-fac3ad9a3d6b";
    let widgetID = null;
    try {
      // WIDGET_ID might not be defined, giving a reference error;
      widgetID = WIDGET_ID;
    } catch (error) {
      // ignore, this is already logged in retrieve widget id section;
    }
    beaconEvent(ClientUnloadedEvent(LOG, widgetID, ORIGIN_ID, CORR_ID));
  }
  window.addEventListener("unload", onUnloadEvent);

  const ORIGIN_ID = "02553494-2ee2-43fb-b7e5-826ea0281883";
  const AGENT_ID = UUID();
  const CORR_ID = UUID();

  const textWidgetLoadedEvent = ClientLoadedEvent(
    UUID(), // chicken and egg problem between PARENT_ID and WIDGET_ID
    ORIGIN_ID,
    CORR_ID
  );
  const PARENT_ID = textWidgetLoadedEvent.id;
  log(`loaded successfully`, ["info", "text"], ORIGIN_ID, CORR_ID, PARENT_ID);

  // retrieve widget id
  const WIDGET_ID = ((): UUID => {
    try {
      const script = getElementById(INSERT_SCRIPT_ID);
      const urlString = script.getAttribute("src");
      if (!urlString) {
        throw new Error("script src attribute missing");
      }
      const a = document.createElement("a");
      a.href = urlString;
      const url = new URL(a.href);
      const id = url.searchParams.get("widget_id");
      if (!IsUUID(id)) {
        throw new Error("widget id must be provided");
      }
      log(
        `widget_id retrieved successfully: ${id} `,
        ["info", "text"],
        ORIGIN_ID,
        CORR_ID,
        PARENT_ID
      );
      return id;
    } catch (error) {
      const message = "widget_id could not be retrieved";
      log(message, ["error", "text"], ORIGIN_ID, CORR_ID, PARENT_ID);
      throw new Error(message);
    }
  })();

  // widget loaded event
  textWidgetLoadedEvent.widget = WIDGET_ID;
  const loadedResult = await postEvent(textWidgetLoadedEvent);
  if (IsError(loadedResult)) {
    log(
      `could not post to api: ${API_ENDPOINT + EVENTS_ENDPOINT}`,
      ["error", "text"],
      ORIGIN_ID,
      CORR_ID,
      PARENT_ID
    );
    // if the api is not reposnsive the button wont show. conversely, all other api calls will work so no need to check response
    return;
  } else {
    log(
      `api posted to successfully: ${API_ENDPOINT + EVENTS_ENDPOINT}`,
      ["info", "text"],
      ORIGIN_ID,
      CORR_ID,
      PARENT_ID
    );
  }

  // Retrieve Widget Settings
  const textWidgetSettingsQuery = TextWidgetSettingsQuery(
    WIDGET_ID,
    AGENT_ID,
    ORIGIN_ID,
    CORR_ID,
    textWidgetLoadedEvent.id
  );
  const settingsResult = await postEvent<ITextWidgetSettings>(
    textWidgetSettingsQuery
  );
  if (!IsTextWidgetSettings(settingsResult.data)) {
    log(settingsResult.data, ["error", "text"], ORIGIN_ID, CORR_ID, PARENT_ID);
    return;
  }
  log(
    `settings retrieved successfully`,
    ["error", "text"],
    ORIGIN_ID,
    CORR_ID,
    PARENT_ID
  );
  const textWidgetSettings = settingsResult.data;

  // CHECK IF WIDGET IS ENABLED
  if (!textWidgetSettings.enabled) {
    log(`widget disabled`, ["info", "text"], ORIGIN_ID, CORR_ID, PARENT_ID);
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
  log(`css inserted`, ["info", "text"], ORIGIN_ID, CORR_ID, PARENT_ID);

  // INSERT HTML
  (() => {
    const div = document.createElement("div");
    div.innerHTML = generateHTML();
    document.getElementsByTagName("body")[0].appendChild(div);
  })();
  log(`html inserted`, ["info", "text"], ORIGIN_ID, CORR_ID, PARENT_ID);

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

  log(`elements loaded`, ["info", "text"], ORIGIN_ID, CORR_ID, PARENT_ID);

  async function onOpenedEvent(): Promise<void> {
    const ORIGIN_ID = "066548fe-cc82-475c-82d9-9bacfbf39104";
    container.style.width = "37rem";
    openButton.classList.remove("shown");
    messageButton.classList.add("shown");
    messageInput.classList.add("shown");
    messageInput.focus();
    const command = TextWidgetOpenedCommand(
      WIDGET_ID,
      AGENT_ID,
      ORIGIN_ID,
      CORR_ID,
      textWidgetLoadedEvent.id
    );
    postEvent(command);
  }
  openButton.addEventListener("click", onOpenedEvent);

  async function onMessageAddedEvent() {
    const ORIGIN_ID = "ccaeae68-b431-4fd0-95c5-d13abeb12cb7";
    const message = messageInput.value;
    if (IsNonEmptyString(message)) {
      container.style.width = "23rem";
      messageButton.classList.remove("shown");
      messageInput.classList.remove("shown");
      phoneInput.classList.add("shown");
      phoneButton.classList.add("shown");
      phoneInput.focus();
      const command = TextWidgetMessageAddedCommand(
        message.trim(),
        WIDGET_ID,
        AGENT_ID,
        ORIGIN_ID,
        CORR_ID,
        textWidgetLoadedEvent.id
      );
      postEvent(command);
    } else {
      messageInput.setCustomValidity("Invalid");
    }
  }
  messageButton.addEventListener("click", onMessageAddedEvent);

  async function onPhoneAddedEvent() {
    const ORIGIN_ID = "d868878e-e438-474f-95ff-654536e665d9";
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
    const command = TextWidgetPhoneAddedCommand(
      phone,
      WIDGET_ID,
      AGENT_ID,
      ORIGIN_ID,
      CORR_ID,
      textWidgetLoadedEvent.id
    );
    postEvent(command);
  }
  phoneButton.addEventListener("click", onPhoneAddedEvent);

  async function onNameAddedAndSentEvent() {
    const ORIGIN_ID = "67a2a42b-2a4b-47e9-9550-6395cba39ff0";
    const personName = nameInput.value;
    if (IsPersonName(personName)) {
      nameInput.classList.remove("shown");
      sendButton.classList.remove("shown");
      loaderMessage.classList.add("shown");
      container.style.width = "";
      const nameAddedCommand = TextWidgetNameAddedCommand(
        personName,
        WIDGET_ID,
        AGENT_ID,
        ORIGIN_ID,
        CORR_ID,
        textWidgetLoadedEvent.id
      );
      const sentCommand = TextWidgetSentCommand(
        WIDGET_ID,
        AGENT_ID,
        ORIGIN_ID,
        CORR_ID,
        textWidgetLoadedEvent.id
      );

      try {
        await postEvent(nameAddedCommand);
        await postEvent(sentCommand);
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

  log(
    `event listeners loaded`,
    ["info", "text"],
    ORIGIN_ID,
    CORR_ID,
    PARENT_ID
  );
  log(
    `initialized successfully`,
    ["info", "text"],
    ORIGIN_ID,
    CORR_ID,
    PARENT_ID
  );
}

window.addEventListener("load", HuckleberryTextWidget, false);
