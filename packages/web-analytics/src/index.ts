import * as Client from "./client";
import * as Interfaces from "./interfaces";
import * as Server from "./server";
import * as SDK from "./sdk";

export type Names = Client.Names | Server.Names;

export const Codecs = new Map([
  ...Array.from(Client.Codecs.entries()),
  ...Array.from(Server.Codecs.entries()),
]);

export { Client, Server, SDK, Interfaces };
