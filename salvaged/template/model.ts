import { AttachmentData } from "@sendgrid/helpers/classes/attachment";

export class Content {
  id: string;
  title: string;
  text: string;
  html: string;
  attachments: AttachmentData[];
}

export class Template {
  id: string;
  generate(data: { [key: string]: string }): Content {
    return new Content();
  }
}
