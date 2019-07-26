import axios from "axios";
import uuid from "uuid/v4";
import { API_URL, CORR_ID, PARENT_ID } from "../config";
import { log, getElementById, setAttributeById } from "../helpers";
import {
  HTML_LOAD_TIMEOUT,
  CSS_ID,
  CONTAINER_ID,
  APP_ID_INPUT_ID,
  MESSAGE_INPUT_ID,
  OPEN_BUTON_ID,
  MESSAGE_BUTTON_ID,
  PHONE_INPUT_ID,
  PHONE_BUTTON_ID,
  NAME_INPUT_ID,
  SEND_BUTTON_ID,
  INVALID_MESSAGE_ID,
  SUCCESS_MESSAGE_ID,
  LOADER_MESSAGE_ID,
  ERROR_MESSAGE_ID,
  SUCCESS_MOUNT_ID,
  ERROR_MOUNT_ID,
} from "./constants";
import { HTML } from "./html";
import { validatePhone, validateString, normalizePhone } from "./validators";
import {
  WidgetSentAction,
  WidgetPhoneAddedAction,
  WidgetMessageAddedAction,
  WidgetOpenedAction,
  WidgetNameAddedAction,
} from "./actions";

// API
export const EVENTS_ENDPOINT = API_URL + "widgets/events";
export const STYLESHEET_ENDPOINT = "./stylesheet";

export class WidgetService {
  private agentID: string = uuid();
  private container!: HTMLElement;
  private openButton!: HTMLElement;
  private messageInput!: HTMLElement;
  private messageButton!: HTMLElement;
  private phoneInput!: HTMLElement;
  private phoneButton!: HTMLElement;
  private nameInput!: HTMLElement;
  private sendButton!: HTMLElement;
  private invalidMessage!: HTMLElement;
  private successMessage!: HTMLElement;
  private errorMessage!: HTMLElement;
  private loaderMessage!: HTMLElement;
  constructor(private appID: string) {}
  init() {
    this.loadCSS();
  }
  showInvalidMessage(message: string): void {
    this.invalidMessage.innerHTML = message;
    this.invalidMessage.classList.add("shown");
    setTimeout(() => {
      this.invalidMessage.classList.remove("shown");
    }, 500);
  }
  async onOpenedEvent(): Promise<void> {
    const nodeID = "";
    this.container.style.width = "37rem";
    this.openButton.classList.remove("shown");
    this.messageButton.classList.add("shown");
    this.messageInput.classList.add("shown");
    this.messageInput.focus();
    const action = new WidgetOpenedAction(
      nodeID,
      CORR_ID,
      PARENT_ID,
      this.appID,
      this.agentID
    );
    const res = await axios.post(EVENTS_ENDPOINT + this.appID, action);
    if (res.status >= 200 && res.status < 300) {
      log("Opened");
    }
  }
  async onMessageAddedEvent() {
    const nodeID = "";
    const message = this.messageInput.getAttribute("value");
    if (message && validateString(message)) {
      this.container.style.width = "23rem";
      this.invalidMessage.classList.remove("shown");
      this.messageButton.classList.remove("shown");
      this.messageInput.classList.remove("shown");
      this.phoneInput.classList.add("shown");
      this.phoneButton.classList.add("shown");
      this.phoneInput.focus();
      const action = new WidgetMessageAddedAction(
        nodeID,
        CORR_ID,
        PARENT_ID,
        this.appID,
        this.agentID,
        message.trim()
      );
      const res = await axios.post(EVENTS_ENDPOINT + this.appID, action);
      if (res.status >= 200 && res.status < 300) {
        log("Message Added");
      }
    } else {
      this.showInvalidMessage("Message Required");
    }
  }
  async onPhoneAddedEvent() {
    const nodeID = "";
    const phone = this.phoneInput.getAttribute("value");
    if (validatePhone(phone)) {
      this.container.style.width = "27rem";
      this.invalidMessage.classList.remove("shown");
      this.phoneButton.classList.remove("shown");
      this.phoneInput.classList.remove("shown");
      this.nameInput.classList.add("shown");
      this.sendButton.classList.add("shown");
      this.nameInput.focus();
      const normPhone = normalizePhone(phone);
      if (normPhone) {
        const action = new WidgetPhoneAddedAction(
          nodeID,
          CORR_ID,
          PARENT_ID,
          this.appID,
          this.agentID,
          normPhone
        );
        const res = await axios.post(EVENTS_ENDPOINT + this.appID, action);
        if (res.status >= 200 && res.status < 300) {
          log("Phone Added");
        }
      }
    } else {
      this.showInvalidMessage("Valid Phone # Required");
    }
  }
  async onNameAddedAndSentEvent() {
    const nodeID = "";
    log("Name Added and Sent");
    const name = this.nameInput.getAttribute("value");
    const message = this.messageInput.getAttribute("value");
    const phone = this.phoneInput.getAttribute("value");
    const CHECK_MARK_HTML = `<img id="turtle-text-success-message" src="./icons/check-mark.svg" alt="success">`;
    const X_MARK_HTML = `<img id="turtle-text-error-message" src="./icons/x-mark.svg" alt="error">`;
    if (
      name &&
      validateString(name) &&
      message &&
      validateString(message) &&
      phone &&
      validatePhone(phone)
    ) {
      this.nameInput.style.transition = "all .4s ease";
      this.sendButton.style.transition = "all .4s ease";
      this.invalidMessage.classList.remove("shown");
      this.nameInput.classList.remove("shown");
      this.sendButton.classList.remove("shown");
      this.container.style.transition =
        "all .4s cubic-bezier(0.47, 0.47, 0.27, 1.20) .4s";
      this.container.style.width = "";
      const nameAddedAction = new WidgetNameAddedAction(
        nodeID,
        CORR_ID,
        PARENT_ID,
        this.appID,
        this.agentID,
        name.trim()
      );
      const sentAction = new WidgetSentAction(
        nodeID,
        CORR_ID,
        PARENT_ID,
        this.appID,
        this.agentID
      );
      const res1 = await axios.post(EVENTS_ENDPOINT, nameAddedAction);
      if (res1.status >= 200 && res1.status < 300) {
        log("Name Added");
      }
      const res2 = await axios.post(EVENTS_ENDPOINT, sentAction);
      if (res2.status >= 200 && res2.status < 300) {
        log("Sent");
        getElementById(SUCCESS_MOUNT_ID).innerHTML = CHECK_MARK_HTML;
        this.successMessage = getElementById(SUCCESS_MESSAGE_ID);
        setTimeout(() => {
          this.loaderMessage.classList.remove("shown");
          this.successMessage.classList.add("shownMessage");
        }, 100);
      } else {
        getElementById(ERROR_MOUNT_ID).innerHTML = X_MARK_HTML;
        this.errorMessage = getElementById(ERROR_MESSAGE_ID);
        setTimeout(() => {
          this.loaderMessage.classList.remove("shown");
          this.errorMessage.classList.add("shownMessage");
        }, 100);
        this.errorMessage.classList.add("shown");
      }
    } else {
      this.showInvalidMessage("Name Required");
    }
  }
  setElements(): void {
    this.container = getElementById(CONTAINER_ID);
    this.openButton = getElementById(OPEN_BUTON_ID);
    this.messageInput = getElementById(MESSAGE_INPUT_ID);
    this.messageButton = getElementById(MESSAGE_BUTTON_ID);
    this.phoneInput = getElementById(PHONE_INPUT_ID);
    this.phoneButton = getElementById(PHONE_BUTTON_ID);
    this.nameInput = getElementById(NAME_INPUT_ID);
    this.sendButton = getElementById(SEND_BUTTON_ID);
    this.loaderMessage = getElementById(LOADER_MESSAGE_ID);
    this.invalidMessage = getElementById(INVALID_MESSAGE_ID);
    this.successMessage = getElementById(SUCCESS_MESSAGE_ID);
    this.errorMessage = getElementById(ERROR_MESSAGE_ID);
  }
  setEventHandlers(): void {
    this.openButton.addEventListener("click", this.onOpenedEvent);
    this.messageButton.addEventListener("click", this.onMessageAddedEvent);
    this.phoneButton.addEventListener("click", this.onPhoneAddedEvent);
    this.sendButton.addEventListener("click", this.onNameAddedAndSentEvent);
    log("Event Handlers Set");
  }
  setAppID(): void {
    setAttributeById(APP_ID_INPUT_ID, "value", this.appID);
  }
  loadCSS(): void {
    if (!document.getElementById(CSS_ID)) {
      const head = document.getElementsByTagName("head")[0];
      const link = document.createElement("link");
      link.id = CSS_ID;
      link.rel = "stylesheet";
      link.type = "text/css";
      link.href = STYLESHEET_ENDPOINT + this.appID;
      link.media = "all";
      link.onload = this.onCSSLoaded;
      head.appendChild(link);
    }
  }
  loadHTML(): void {
    document.body.innerHTML = document.body.innerHTML + HTML;
    setTimeout(this.onHTMLLoaded, HTML_LOAD_TIMEOUT);
  }
  onCSSLoaded(): void {
    log("CSS Loaded");
    this.loadHTML();
  }
  onHTMLLoaded(): void {
    log("HTML Loaded");
    this.setElements();
    this.setAppID();
    this.setEventHandlers();
  }
}
