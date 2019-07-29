import {
  type BrowserClient,
  type DOMClient,
  type HTTPClient,
} from "../RetrieverFactory";

export interface IRetriever {
  browserClient: BrowserClient;
  domClient: DOMClient;
  httpClient: HTTPClient;
  constructor(
    browserClient: BrowserClient,
    domClient: DOMClient,
    httpClient: HTTPClient
  ): void;
  getStaticDOM(uri: string): Promise<DOMClient>;
  getDynamicDOM(uri: string): Promise<DOMClient>;
  getStaticBuffer(uri: string): Promise<Buffer>;
  getStaticJSON(uri: string): Promise<Object>;
}

export default class Retriever implements IRetriever {
  browserClient: BrowserClient;
  domClient: DOMClient;
  httpClient: HTTPClient;
  constructor(
    browserClient: BrowserClient,
    domClient: DOMClient,
    httpClient: HTTPClient
  ): void {
    this.browserClient = browserClient;
    this.domClient = domClient;
    this.httpClient = httpClient;
  }
  async getStaticDOM(uri: string): Promise<DOMClient> {
    const response = await this.httpClient({
      method: "get",
      url: uri,
      responseType: "text",
    });
    const $ = this.domClient.load(response.data);
    return $;
  }
  async getDynamicDOM(uri: string): Promise<DOMClient> {
    const page = await this.browserClient.newPage();
    await page.goto(uri, {
      timeout: 3000000,
    });
    const $ = this.domClient.load(await page.content());
    page.close();
    return $;
  }
  async getStaticBuffer(uri: string): Promise<Buffer> {
    const response = await this.httpClient({
      method: "get",
      url: uri,
      responseType: "arraybuffer",
    });
    return Buffer.from(response.data);
  }
  async getStaticJSON(uri: string): Promise<Object> {
    const response = await this.httpClient({
      method: "get",
      url: uri,
      responseType: "json",
    });
    return response.json();
  }
  async scrapeHrefs(
    $: DOMClient,
    filter: string => boolean
  ): Promise<Array<string>> {
    const links = $("a");
    return links
      .map((i, a) => $(a).attr("href"))
      .get()
      .filter(href => filter(href));
  }
}
