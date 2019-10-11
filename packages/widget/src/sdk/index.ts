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
  widget: UUID,
  corr: UUID,
  parent: UUID
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
  widget: UUID,
  corr: UUID,
  parent: UUID
) => async () =>
  pipe(
    Create.Command(widget, corr, parent),
    map(query => {
      pipe(
        EndpointFromEvent(query),
        map(async url => {
          pipe(
            await Post(url, Create.CommandCodec.encode(query)),
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
  widget: UUID,
  corr: UUID,
  parent: UUID
) => async () =>
  pipe(
    AddText.Command(message, widget, corr, parent),
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
  phone: Phone,
  widget: UUID,

  corr: UUID,
  parent: UUID
) => async () =>
  pipe(
    AddPhone.Command(phone, widget, corr, parent),
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
  name: PersonName,
  widget: UUID,
  corr: UUID,
  parent: UUID
) => async () =>
  pipe(
    AddName.Command(name, widget, corr, parent),
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
  widget: UUID,
  corr: UUID,
  parent: UUID
) => async () =>
  pipe(
    Send.Command(widget, corr, parent),
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
