import { BrowserClient, DOMClient, HTTPClient } from "../retriever-factory";

export interface IRetriever {
  browserClient: BrowserClient;
  domClient: DOMClient;
  httpClient: HTTPClient;
  getStaticDOM(uri: string): Promise<CheerioStatic>;
  getDynamicDOM(uri: string): Promise<CheerioStatic>;
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
  ) {
    this.browserClient = browserClient;
    this.domClient = domClient;
    this.httpClient = httpClient;
  }
  async getStaticDOM(uri: string): Promise<CheerioStatic> {
    const response = await this.httpClient({
      method: "get",
      url: uri,
      responseType: "text"
    });
    const $ = this.domClient.load(response.data);
    return $;
  }
  async getDynamicDOM(uri: string): Promise<CheerioStatic> {
    const page = await this.browserClient.newPage();
    await page.goto(uri, {
      timeout: 3000000
    });
    const $ = this.domClient.load(await page.content());
    page.close();
    return $;
  }
  async getStaticBuffer(uri: string): Promise<Buffer> {
    const response = await this.httpClient({
      method: "get",
      url: uri,
      responseType: "arraybuffer"
    });
    return Buffer.from(response.data);
  }
  async getStaticJSON(uri: string): Promise<Object> {
    const response = await this.httpClient({
      method: "get",
      url: uri,
      responseType: "json"
    });
    return response.data;
  }
  async scrapeHrefs(
    $: DOMClient,
    _filter: string,
    _boolean: any
  ): Promise<string[]> {
    const links = $("a");
    return links
      .map((_i: any, a: any) => $(a).attr("href"))
      .get()
      .filter((href: string) => href);
  }
}