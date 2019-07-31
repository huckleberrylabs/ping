import { ID } from "@huckleberry/core";
import {
  TextAppLoadedEvent,
  TextAppSentCommand,
  TextAppPhoneAddedCommand,
  TextAppMessageAddedCommand,
  TextAppOpenedCommand,
  TextAppNameAddedCommand,
  validatePhone,
  validateString,
  normalizePhone,
  STYLESHEET_ENDPOINT,
} from "@huckleberry/text";
import {
  HTML_LOAD_TIMEOUT,
  CSS_ID,
  INSERT_SCRIPT_ID,
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
  ERROR_MESSAGE_ID,
} from "./constants";
import { getAttributeById } from "./helpers";
import { log, getElementById, setAttributeById } from "./helpers";
import { API } from "./api";
import { HTML } from "./html";

export class TextApp {
  private api: API = new API();
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
  async init() {
    const NODE_ID = "";
    const config = await this.api.getConfig(this.id);
    if (config.enabled) {
      this.loadCSS();
    }
    if (config.analyticsEnabled) {
      // Add Here Analytics
    }
    const event = new TextAppLoadedEvent(
      NODE_ID,
      this.corrID,
      this.parentID,
      this.id
    );
    await this.api.postEvent(event);
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
    const command = new TextAppOpenedCommand(
      nodeID,
      this.corrID,
      this.parentID,
      this.appID,
      this.agentID
    );
    log("Opened");
    await this.api.postEvent(command);
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
      const command = new TextAppMessageAddedCommand(
        nodeID,
        this.corrID,
        this.parentID,
        this.appID,
        this.agentID,
        message.trim()
      );
      log("Message Added");
      await this.api.postEvent(command);
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
        const command = new TextAppPhoneAddedCommand(
          nodeID,
          this.corrID,
          this.parentID,
          this.appID,
          this.agentID,
          normPhone
        );
        log("Phone Added");
        await this.api.postEvent(command);
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
      const nameAddedCommand = new TextAppNameAddedCommand(
        nodeID,
        this.corrID,
        this.parentID,
        this.appID,
        this.agentID,
        name.trim()
      );
      const sentCommand = new TextAppSentCommand(
        nodeID,
        this.corrID,
        this.parentID,
        this.appID,
        this.agentID
      );
      log("Name Added");
      await this.api.postEvent(nameAddedCommand);
      try {
        log("Sent");
        await this.api.postEvent(sentCommand);
        this.successMessage.classList.add("shown");
      } catch (error) {
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
  get id(): string {
    const urlString = getAttributeById(INSERT_SCRIPT_ID, "src");
    if (urlString) {
      const a = document.createElement("a");
      a.href = urlString;
      const url = new URL(a.href);
      const id = url.searchParams.get("app_id");
      if (id) {
        return id;
      }
    }
    throw new Error("App ID Must Be Provided");
  }
  get agentID() {
    return "";
  }
  get corrID() {
    return "";
  }
  get parentID() {
    return "";
  }
}
