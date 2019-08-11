import Imap from "imap";
import { Config } from "@huckleberry/config";
import { Logger } from "../logger";

export class IMAP {
  client: Imap;
  constructor(private config: Config, private logger: Logger) {
    this.client = new Imap(config.imap);
  }
  onError(err: any) {
    this.logger.log("error", err);
  }
  onEnd() {
    this.logger.log("info", "Connection ended");
  }
  start() {
    this.client.once("ready", () => {
      this.client.openBox("INBOX", true, (err: Error, box: Imap.Box) => {
        if (err) {
          throw err;
        }
        var fetch = this.client.seq.fetch("1:3", {
          bodies: "HEADER.FIELDS (FROM TO SUBJECT DATE)",
          struct: true,
        });
        fetch.on("message", (msg: any, seqno: any) => {
          this.logger.log("info", "Message #%d", seqno);
          var prefix = "(#" + seqno + ") ";
          msg.on("body", (stream: any, info: any) => {
            var buffer = "";
            stream.on("data", (chunk: any) => {
              buffer += chunk.toString("utf8");
            });
            stream.once("end", () => {
              this.logger.log(
                "info",
                prefix + "Parsed header: " + Imap.parseHeader(buffer)
              );
            });
          });
          msg.once("attributes", (attrs: any) => {
            this.logger.log("info", prefix + "Attributes: " + attrs);
          });
          msg.once("end", () => {
            this.logger.log("info", prefix + "Finished");
          });
        });
        fetch.once("error", (err: any) => {
          this.logger.log("error", "Fetch error: " + err);
        });
        fetch.once("end", () => {
          this.logger.log("info", "Done fetching all messages!");
          this.client.end();
        });
      });
    });
    this.client.once("error", this.onError);
    this.client.once("end", this.onEnd);
    this.client.connect();
  }
}
