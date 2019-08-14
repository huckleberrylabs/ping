import { injectable } from "inversify";

export const CONTEXT_ID = "a91bd9cd-8015-4611-a0f8-a465a9219b4f";
const URL = "http://localhost";
const NAME = "rotaru-co";
const API_PORT = 8000;

@injectable()
export class Config {
  name: string;
  api: {
    port: number;
    url: string;
  };
  security: {
    secret: string;
    origin: string;
    withCredentials: boolean;
  };
  log: {
    host: string;
    port: number;
    timeout: number;
    reconnectInterval: number;
  };
  mailer: {
    apiKey: string;
  };
  imap: {
    user: string;
    password: string;
    host: string;
    port: number;
    tls: boolean;
  };
  weather: {
    apiKey: string;
  };
  dkron: {
    baseUrl: string;
  };
  mongo: {
    url: string;
  };
  constructor() {
    this.name = NAME;
    this.api = {
      port: API_PORT,
      url: `${URL}:${API_PORT}`,
    };
    this.security = {
      secret: "povjewfpovejmfwxjf-xwefj-piwfx-epo",
      origin: URL,
      withCredentials: true,
    };
    this.log = {
      host: "localhost",
      port: 24224,
      timeout: 3.0,
      reconnectInterval: 600000, // 10 minutes
    };
    this.mailer = { apiKey: "" };
    this.imap = {
      user: "mygmailname@gmail.com",
      password: "mygmailpassword",
      host: "imap.gmail.com",
      port: 993,
      tls: true,
    };
    this.weather = { apiKey: "90e97ae0ad15e814efffac9196f584a3" };
    this.dkron = { baseUrl: "http://localhost:8080/v1" };
    this.mongo = { url: "mongodb://localhost:27017" };
  }
}
