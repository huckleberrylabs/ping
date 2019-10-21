import {
  UUID,
  HTTP,
  Phone,
  PersonName,
  NonEmptyString,
} from "@huckleberryai/core";
import { SDK } from "../interfaces";
import * as Settings from "../settings/entity";
import * as Queries from "../settings/use-cases";
import { Create, AddText, AddPhone, AddName, Send } from "../message/use-cases";

type SDKC = (widget: UUID.T, corr: UUID.T) => SDK;

export const C: SDKC = (widget: UUID.T, corr: UUID.T): SDK => ({
  Message: {
    Create: async () => {
      const message = UUID.C();
      const command = Create.Command.C(message, widget, corr);
      const url = HTTP.EndpointFromEvent(command);
      HTTP.Post(url, Create.Command.Codec.encode(command), UUID.Codec);
      return message;
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
  Settings: {
    Get: async () => {
      const query = Queries.GetByID.Query.C(widget, corr);
      const url = HTTP.EndpointFromEvent(query);
      const res = await HTTP.Post(
        url,
        Queries.GetByID.Query.Codec.encode(query),
        Settings.Codec
      );
      return res;
    },
  },
});
