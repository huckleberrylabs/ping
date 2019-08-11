import { MailService } from "@sendgrid/mail";
import { Config } from "@huckleberry/config";
import { MailData } from "@sendgrid/helpers/classes/mail";

export class SMTP {
  client: typeof MailService;
  constructor(config: Config) {
    this.client = MailService;
    this.client.setApiKey(config.mailer.apiKey);
  }
  send(data: MailData, isMultiple: boolean): Promise<any> {
    return this.client.send(data, isMultiple);
  }
}
