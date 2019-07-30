import puppeteer from "puppeteer";
import cheerio from "cheerio";
import axios, { AxiosInstance } from "axios";
import { type IServiceFactory } from "../interfaces";
import Retriever, { type IRetriever } from "../Retriever";
import Framework from "../../Framework";

export type BrowserClient = puppeteer.Browser;
export type DOMClient = Cheerio;
export type HTTPClient = AxiosInstance;
export type RetrieverConfig = {};
export type IRetrieverFactory = IServiceFactory<IRetriever, RetrieverConfig>;
export default class RetrieverFactory implements IRetrieverFactory {
  httpClient: HTTPClient;
  browserClient: Browser;
  domClient: DOMClient;
  constructor(framework: Framework, config: RetrieverConfig): void {
    this.domClient = cheerio;
    this.httpClient = axios;
    this.initialize();
  }
  async initialize() {
    this.browserClient = await puppeteer.launch();
    process.once("SIGINT", () => this.browserClient.close());
  }
  get(): IRetriever {
    return new Retriever(this.browserClient, this.domClient, this.httpClient);
  }
}
