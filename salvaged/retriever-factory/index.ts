import puppeteer from "puppeteer";
import cheerio from "cheerio";
import axios, { AxiosInstance } from "axios";
import Retriever, { IRetriever } from "../retriever";

export type BrowserClient = puppeteer.Browser;
export type DOMClient = CheerioAPI;
export type HTTPClient = AxiosInstance;

export default class RetrieverFactory {
  httpClient: HTTPClient;
  browserClient?: BrowserClient;
  domClient: DOMClient;
  constructor() {
    this.domClient = cheerio;
    this.httpClient = axios;
    this.initialize();
  }
  async initialize() {
    const browserClient = await puppeteer.launch();
    process.once("SIGINT", () => browserClient.close());
    this.browserClient = browserClient;
  }
  get(): IRetriever {
    if (!this.browserClient) {
      throw new Error("Must be initialized first");
    }
    return new Retriever(this.browserClient, this.domClient, this.httpClient);
  }
}
