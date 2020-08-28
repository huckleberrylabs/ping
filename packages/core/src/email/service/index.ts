import { PersonName, TimeStamp, NameSpaceCaseString } from "../../values";
import { Email, EmailTemplate, EmailOptions } from "../model";
import { IEmailService, ISendGrid } from "../../interfaces";

export const Name = "email:service" as NameSpaceCaseString.T;

export const C = (client: ISendGrid): IEmailService => async (
  emails: Email[],
  template: EmailTemplate,
  options?: EmailOptions
) =>
  client({
    personalizations: emails.map(email => ({
      to: {
        email: email.to.address,
        name: email.to.name ? PersonName.FirstLast(email.to.name) : undefined,
      },
      cc: email.cc
        ? {
            email: email.cc.address,
            name: email.cc.name
              ? PersonName.FirstLast(email.cc.name)
              : undefined,
          }
        : undefined,
      bcc: email.bcc
        ? {
            email: email.bcc.address,
            name: email.bcc.name
              ? PersonName.FirstLast(email.bcc.name)
              : undefined,
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
