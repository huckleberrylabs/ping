import { HTTP, UUID, NonEmptyString, PersonName } from "@huckleberryai/core";
import { PrivateSDK } from "../../interfaces";
import { RegisterAccount } from "../../use-cases";
import {
  GetByID,
  AddWidget,
  Update,
  UpdateWidget,
} from "../../account/use-cases";
import * as Account from "../../account";
import * as Widget from "../../widget";

export const C = (): PrivateSDK => ({
  Account: {
    Get: async (account: UUID.T, corr?: UUID.T) => {
      const query = GetByID.Query.C(account, corr);
      const url = HTTP.EndpointFromEvent(query);
      return await HTTP.Post(
        url,
        GetByID.Query.Codec.encode(query),
        Account.Codec
      );
    },
    Register: async (
      stripeToken: NonEmptyString.T,
      email: NonEmptyString.T,
      userName: PersonName.T,
      billingEmail?: NonEmptyString.T,
      name?: NonEmptyString.T,
      corr?: UUID.T
    ) => {
      const command = RegisterAccount.Command.C(
        stripeToken,
        email,
        userName,
        billingEmail,
        name,
        corr
      );
      const url = HTTP.EndpointFromEvent(command);
      return await HTTP.Post(
        url,
        RegisterAccount.Command.Codec.encode(command),
        UUID.Codec
      );
    },
    Update: async (
      account: UUID.T,
      email: NonEmptyString.T,
      userName: PersonName.T,
      billingEmail?: NonEmptyString.T,
      name?: NonEmptyString.T,
      corr?: UUID.T
    ) => {
      const command = Update.Command.C(
        account,
        email,
        userName,
        billingEmail,
        name,
        corr
      );
      const url = HTTP.EndpointFromEvent(command);
      return await HTTP.Post(url, Update.Command.Codec.encode(command));
    },
  },
  Widget: {
    Add: async (account: UUID.T, widget: Widget.T, corr?: UUID.T) => {
      const command = AddWidget.Command.C(account, widget, corr);
      const url = HTTP.EndpointFromEvent(command);
      return await HTTP.Post(
        url,
        AddWidget.Command.Codec.encode(command),
        UUID.Codec
      );
    },
    Update: async (account: UUID.T, widget: Widget.T, corr?: UUID.T) => {
      const command = UpdateWidget.Command.C(account, widget, corr);
      const url = HTTP.EndpointFromEvent(command);
      return await HTTP.Post(url, UpdateWidget.Command.Codec.encode(command));
    },
  },
});
