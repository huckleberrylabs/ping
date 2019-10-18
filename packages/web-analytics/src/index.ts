import * as Client from "./client";
import * as Interfaces from "./interfaces";
import * as Server from "./server";
import SDK from "./sdk";

export type Names = Client.Names | Server.Names;

export const Codecs = new Map([...Client.Codecs, ...Server.Codecs]);

export { Client, Server, SDK, Interfaces };
