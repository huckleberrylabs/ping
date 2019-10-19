import { left, isLeft } from "fp-ts/lib/Either";
import {
  UUID,
  HTTP,
  Phone,
  PersonName,
  NonEmptyString,
  Errors,
} from "@huckleberryai/core";
import * as Settings from "../settings/entity";
import * as Queries from "../settings/use-cases";
import { Create, AddText, AddPhone, AddName, Send } from "../message/use-cases";

const GetSettingsByID = (widget: UUID.T, corr?: UUID.T) => async () => {
  const query = Queries.GetByID.Query.C(widget, corr);
  const url = HTTP.EndpointFromEvent(query);
  if (isLeft(url)) return url;
  const res = await HTTP.Post(url.right, query, Settings.Codec.decode);
  return res;
};

const CreateMessage = (widget: UUID.T, corr: UUID.T) => async () => {
  const message = UUID.C();
  const command = Create.Command.C(message, widget, corr);
  const url = HTTP.EndpointFromEvent(command);
  if (isLeft(url)) return url;
  const res = await HTTP.Post(url.right, command, UUID.Codec.decode);
  return res;
};

const AddTextToMessage = (widget: UUID.T, corr: UUID.T) => async (
  message: UUID.T,
  text: string
) => {
  if (!NonEmptyString.Is(text)) return left(Errors.Validation.C());
  const command = AddText.Command.C(text, message, widget, corr);
  const url = HTTP.EndpointFromEvent(command);
  if (isLeft(url)) return url;
  const res = await HTTP.Post(url.right, command);
  return res;
};

const AddPhoneToMessage = (widget: UUID.T, corr: UUID.T) => async (
  message: UUID.T,
  phone: Phone.T
) => {
  const command = AddPhone.Command.C(phone, message, widget, corr);
  const url = HTTP.EndpointFromEvent(command);
  if (isLeft(url)) return url;
  const res = await HTTP.Post(url.right, command);
  return res;
};

const AddNameToMessage = (widget: UUID.T, corr: UUID.T) => async (
  message: UUID.T,
  name: PersonName.T
) => {
  const command = AddName.Command.C(name, message, widget, corr);
  const url = HTTP.EndpointFromEvent(command);
  if (isLeft(url)) return url;
  const res = await HTTP.Post(url.right, command);
  return res;
};

const SendMessage = (widget: UUID.T, corr: UUID.T) => async (
  message: UUID.T
) => {
  const command = Send.Command.C(message, widget, corr);
  const url = HTTP.EndpointFromEvent(command);
  if (isLeft(url)) return url;
  const res = await HTTP.Post(url.right, command);
  return res;
};

export default (widget: UUID.T, corr: UUID.T) => ({
  Message: {
    Create: CreateMessage(widget, corr),
    AddText: AddTextToMessage(widget, corr),
    AddPhone: AddPhoneToMessage(widget, corr),
    AddName: AddNameToMessage(widget, corr),
    Send: SendMessage(widget, corr),
  },
  Settings: {
    GetByID: GetSettingsByID(widget, corr),
  },
});
