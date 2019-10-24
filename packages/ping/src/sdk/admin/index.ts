import { HTTP, UUID, NonEmptyString, PersonName } from "@huckleberryai/core";
import { GetByID, AddWidget } from "../../account/use-cases";
import * as Account from "../../account";
import { RegisterAccount } from "../../use-cases";
import { Widget } from "../..";

export const C = () => ({
  Account: {
    Get: async (account: UUID.T, corr: UUID.T) => {
      const query = GetByID.Query.C(account, corr);
      const url = HTTP.EndpointFromEvent(query);
      const res = await HTTP.Post(
        url,
        GetByID.Query.Codec.encode(query),
        Account.Codec
      );
      return res;
    },
    Register: async (
      stripeToken: NonEmptyString.T,
      userName: PersonName.T,
      email: NonEmptyString.T,
      billingEmail?: NonEmptyString.T,
      name?: NonEmptyString.T,
      corr?: UUID.T
    ) => {
      const command = RegisterAccount.Command.C(
        stripeToken,
        userName,
        email,
        billingEmail,
        name,
        corr
      );
      const url = HTTP.EndpointFromEvent(command);
      const idMaybe = await HTTP.Post(
        url,
        RegisterAccount.Command.Codec.encode(command),
        UUID.Codec
      );
      return idMaybe;
    },
    AddWidget: async (widget: Widget.T, account: UUID.T) => {
      const command = AddWidget.Command.C(widget, account);
      const url = HTTP.EndpointFromEvent(command);
      return await HTTP.Post(url, AddWidget.Command.Codec.encode(command));
    },
  },
});
