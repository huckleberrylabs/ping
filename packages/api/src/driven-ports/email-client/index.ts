import { SendGrid } from "../../driven-adapters";
import {
  EmailClient,
  Email,
  EmailTemplate,
  EmailOptions,
  PersonName,
  TimeStamp,
} from "@huckleberrylabs/core";

export const C = (client: SendGrid.T): EmailClient => async (
  emails: Email[],
  template: EmailTemplate,
  options?: EmailOptions
) =>
  client({
    personalizations: emails.map(email => ({
      to: {
        email: email.to.address,
        name: PersonName.FirstLast(email.to.name),
      },
      cc: email.cc
        ? {
            email: email.cc.address,
            name: PersonName.FirstLast(email.cc.name),
          }
        : undefined,
      bcc: email.bcc
        ? {
            email: email.bcc.address,
            name: PersonName.FirstLast(email.bcc.name),
          }
        : undefined,
      dynamicTemplateData: email.dynamicTemplateData,
      substitutions: email.dynamicTemplateData,
      sendAt: email.sendAt ? TimeStamp.ToUnix(email.sendAt) : undefined,
    })),
    templateId: template.id,
    from: {
      name: PersonName.FirstLast(template.from.name),
      email: template.from.address,
    },
    replyTo: {
      name: PersonName.FirstLast(template.replyTo.name),
      email: template.replyTo.address,
    },
    asm: template.unsubscribe,
    categories: template.categories,
    ...options,
  });
