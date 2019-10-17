// @ts-ignore
import * as iots from "io-ts";
import { pipe } from "fp-ts/lib/pipeable";
import { map, left, right } from "fp-ts/lib/Either";
import {
  UUID,
  Post,
  EndpointFromEvent,
  Phone,
  PersonName,
  NonEmptyString,
  Errors,
} from "@huckleberryai/core";
import * as Queries from "../settings/use-cases";
import { Create, AddText, AddPhone, AddName, Send } from "../message/use-cases";

const GetSettingsByID = (widget: UUID.T, corr?: UUID.T) => async () =>
  pipe(
    Queries.GetByID.Query.C(widget, corr),
    query =>
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
  );

const CreateMessage = (widget: UUID.T, corr: UUID.T) => async () =>
  pipe(
    Create.Command.C(widget, corr),
    command =>
      pipe(
        EndpointFromEvent(command),
        map(async url =>
          pipe(
            await Post(url, Create.Command.Codec.encode(command)),
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
  );

const AddTextToMessage = (widget: UUID.T, corr: UUID.T) => async (
  message: string
) =>
  pipe(
    NonEmptyString.Is(message) ? right(message) : left(new Errors.Validation()),
    map(message => AddText.Command.C(message, widget, corr)),
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

const AddPhoneToMessage = (
  widget: UUID.T,

  corr: UUID.T
) => async (phone: Phone.T) =>
  pipe(
    AddPhone.Command.C(phone, widget, corr),
    command =>
      pipe(
        EndpointFromEvent(command),
        map(async url =>
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
          )
        )
      )
  );

const AddNameToMessage = (widget: UUID.T, corr: UUID.T) => async (
  name: PersonName.T
) =>
  pipe(
    AddName.Command.C(name, widget, corr),
    command =>
      pipe(
        EndpointFromEvent(command),
        map(async url =>
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
          )
        )
      )
  );

const SendMessage = (widget: UUID.T, corr: UUID.T) => async () =>
  pipe(
    Send.Command.C(widget, corr),
    command =>
      pipe(
        EndpointFromEvent(command),
        map(async url =>
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
          )
        )
      )
  );

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
