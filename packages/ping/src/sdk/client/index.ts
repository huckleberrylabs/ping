import {
  UUID,
  HTTP,
  Phone,
  PersonName,
  NonEmptyString,
} from "@huckleberryai/core";
import * as Widget from "../../widget/entity";
import { GetByID } from "../../widget/use-cases";
import { CreateMessage } from "../../widget/use-cases";
import { AddText, AddPhone, AddName, Send } from "../../message/use-cases";

export const C = (widget: UUID.T, corr: UUID.T) => ({
  Message: {
    Create: async () => {
      const command = CreateMessage.Command.C(widget, corr);
      const url = HTTP.EndpointFromEvent(command);
      HTTP.Post(url, CreateMessage.Command.Codec.encode(command), UUID.Codec);
      return command.message;
    },
    AddText: async (message: UUID.T, text: NonEmptyString.T) => {
      const command = AddText.Command.C(text, message, widget, corr);
      const url = HTTP.EndpointFromEvent(command);
      const res = await HTTP.Post(url, AddText.Command.Codec.encode(command));
      return res;
    },
    AddPhone: async (message: UUID.T, phone: Phone.T) => {
      const command = AddPhone.Command.C(phone, message, widget, corr);
      const url = HTTP.EndpointFromEvent(command);
      const res = await HTTP.Post(url, AddPhone.Command.Codec.encode(command));
      return res;
    },
    AddName: async (message: UUID.T, name: PersonName.T) => {
      const command = AddName.Command.C(name, message, widget, corr);
      const url = HTTP.EndpointFromEvent(command);
      const res = await HTTP.Post(url, AddName.Command.Codec.encode(command));
      return res;
    },
    Send: async (message: UUID.T) => {
      const command = Send.Command.C(message, widget, corr);
      const url = HTTP.EndpointFromEvent(command);
      const res = await HTTP.Post(url, Send.Command.Codec.encode(command));
      return res;
    },
  },
  Widget: {
    Get: async () => {
      const query = GetByID.Query.C(widget, corr);
      const url = HTTP.EndpointFromEvent(query);
      const res = await HTTP.Post(
        url,
        GetByID.Query.Codec.encode(query),
        Widget.Codec
      );
      return res;
    },
  },
});
