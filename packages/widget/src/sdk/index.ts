import { pipe } from "fp-ts/lib/pipeable";
import { map } from "fp-ts/lib/Either";
import {
  UUID,
  Post,
  EndpointFromEvent,
  Phone,
  PersonName,
} from "@huckleberryai/core";
import { Query } from "../settings/queries";
import { Create, AddText, AddPhone, AddName, Send } from "../message/use-cases";

export const GetSettingsByID = (
  widget: UUID.T,
  corr: UUID.T,
  parent?: UUID.T
) => async () => {
  pipe(
    Query(widget, corr, parent),
    map(query =>
      pipe(
        EndpointFromEvent(query),
        map(async url =>
          pipe(
            await Post(url, query),
            map(res => {
              /* 
                TODO:
                - flatten
                - figure out async
                - decode for all Result Types
              */
            })
          )
        )
      )
    )
  );
};

export const CreateMessage = (
  widget: UUID.T,
  corr: UUID.T,
  parent?: UUID.T
) => async () =>
  pipe(
    Create.Command.C(widget, corr, parent),
    map(query => {
      pipe(
        EndpointFromEvent(query),
        map(async url => {
          pipe(
            await Post(url, Create.Command.Codec.encode(query)),
            map(res => {
              /* 
                  TODO:
                  - flatten
                  - figure out async
                  - decode for all Result Types
                */
            })
          );
        })
      );
    })
  );

export const AddTextToMessage = (
  message: string,
  widget: UUID.T,
  corr: UUID.T,
  parent?: UUID.T
) => async () =>
  pipe(
    AddText.Command.C(message, widget, corr, parent),
    map(command => {
      pipe(
        EndpointFromEvent(command),
        map(async url => {
          pipe(
            await Post(url, command),
            map(res => {
              /* 
                    TODO:
                    - flatten
                    - figure out async
                    - decode for all Result Types
                  */
            })
          );
        })
      );
    })
  );

export const AddPhoneToMessage = (
  phone: Phone.T,
  widget: UUID.T,

  corr: UUID.T,
  parent?: UUID.T
) => async () =>
  pipe(
    AddPhone.Command.C(phone, widget, corr, parent),
    map(command => {
      pipe(
        EndpointFromEvent(command),
        map(async url => {
          pipe(
            await Post(url, command),
            map(res => {
              /* 
                    TODO:
                    - flatten
                    - figure out async
                    - decode for all Result Types
                  */
            })
          );
        })
      );
    })
  );

export const AddNameToMessage = (
  name: PersonName.T,
  widget: UUID.T,
  corr: UUID.T,
  parent?: UUID.T
) => async () =>
  pipe(
    AddName.Command.C(name, widget, corr, parent),
    map(command => {
      pipe(
        EndpointFromEvent(command),
        map(async url => {
          pipe(
            await Post(url, command),
            map(res => {
              /* 
                      TODO:
                      - flatten
                      - figure out async
                      - decode for all Result Types
                    */
            })
          );
        })
      );
    })
  );

export const SendMessage = (
  widget: UUID.T,
  corr: UUID.T,
  parent?: UUID.T
) => async () =>
  pipe(
    Send.Command.C(widget, corr, parent),
    map(query => {
      pipe(
        EndpointFromEvent(query),
        map(async url => {
          pipe(
            await Post(url, query),
            map(res => {
              /* 
                    TODO:
                    - flatten
                    - figure out async
                    - decode for all Result Types
                  */
            })
          );
        })
      );
    })
  );

export const WidgetSDK = {
  Message: {
    Create: CreateMessage,
    AddText: AddTextToMessage,
    AddPhone: AddPhoneToMessage,
    AddName: AddNameToMessage,
    Send: SendMessage,
  },
  Settings: {
    Get: GetSettingsByID,
  },
};
