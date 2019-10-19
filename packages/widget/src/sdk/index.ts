import { left, isLeft, right } from "fp-ts/lib/Either";
import {
  UUID,
  HTTP,
  Phone,
  PersonName,
  NonEmptyString,
  Errors,
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
      if (isLeft(url)) return url;
      HTTP.Post(url.right, command, UUID.Codec);
      return right(message);
    },
    AddText: async (message: UUID.T, text: string) => {
      if (!NonEmptyString.Is(text)) return left(Errors.Validation.C());
      const command = AddText.Command.C(text, message, widget, corr);
      const url = HTTP.EndpointFromEvent(command);
      if (isLeft(url)) return url;
      const res = await HTTP.Post(url.right, command);
      return res;
    },
    AddPhone: async (message: UUID.T, phone: Phone.T) => {
      const command = AddPhone.Command.C(phone, message, widget, corr);
      const url = HTTP.EndpointFromEvent(command);
      if (isLeft(url)) return url;
      const res = await HTTP.Post(url.right, command);
      return res;
    },
    AddName: async (message: UUID.T, name: PersonName.T) => {
      const command = AddName.Command.C(name, message, widget, corr);
      const url = HTTP.EndpointFromEvent(command);
      if (isLeft(url)) return url;
      const res = await HTTP.Post(url.right, command);
      return res;
    },
    Send: async (message: UUID.T) => {
      const command = Send.Command.C(message, widget, corr);
      const url = HTTP.EndpointFromEvent(command);
      if (isLeft(url)) return url;
      const res = await HTTP.Post(url.right, command);
      return res;
    },
  },
  Settings: {
    Get: async () => {
      const query = Queries.GetByID.Query.C(widget, corr);
      const url = HTTP.EndpointFromEvent(query);
      if (isLeft(url)) return url;
      const res = await HTTP.Post(url.right, query, Settings.Codec);
      return res;
    },
  },
});
