import axios from "axios";
import { getAttributeById } from "../helpers";
import { API_URL, CORR_ID, PARENT_ID } from "../config";
import { WidgetService } from "../widget/service";
import { AnalyticsService } from "../analytics";
import { FingerPrintService } from "../fingerprint";
import { AppLoadedEvent } from "./events";

const INSERT_SCRIPT_ID: string = "huckleberry-text-insert-script";
const EVENTS_ENDPOINT = API_URL + "apps/events/";
const CONFIG_ENDPOINT = API_URL + "apps/config/";

type AppConfig = {
  widget: boolean;
  analytics: boolean;
  fingerPrint: boolean;
};

export class App {
  private config: AppConfig | undefined;
  private widgetService: WidgetService | undefined;
  private analyticsService: AnalyticsService | undefined;
  private fingerPrintService: FingerPrintService | undefined;
  async init() {
    const res = await axios.get<AppConfig>(CONFIG_ENDPOINT + this.id);
    this.config = res.data;
    if (this.config.widget) {
      this.widgetService = new WidgetService(this.id);
      this.widgetService.init();
    }
    if (this.config.analytics) {
      this.analyticsService = new AnalyticsService(this.id);
      this.analyticsService.init();
    }
    if (this.config.fingerPrint) {
      this.fingerPrintService = new FingerPrintService(this.id);
      this.fingerPrintService.create();
    }
    const event = new AppLoadedEvent(this.nodeID, CORR_ID, PARENT_ID, this.id);
    await axios.post(EVENTS_ENDPOINT + this.id, event);
  }
  get id(): string {
    const urlString = getAttributeById(INSERT_SCRIPT_ID, "src");
    if (urlString) {
      const url = new URL(urlString);
      const id = url.searchParams.get("app_id");
      if (id) {
        return id;
      }
    }
    throw new Error("App ID Must Be Provided");
  }
  get nodeID() {
    return "";
  }
}
