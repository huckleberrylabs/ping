import * as iots from "io-ts";
import * as Event from "../../event";
import { Type, StatusCode } from "../../values";
import * as Ok from "../ok";

export const Name = "core:result:ok-with-data";

export const Codec = <DataCodec extends iots.Mixed>(codec: DataCodec) =>
  iots.intersection(
    [
      iots.interface({
        data: codec,
        dataType: Type.Codec,
      }),
      Ok.Codec,
    ],
    Name
  );

export type T<DataType> = Ok.T & {
  data: DataType;
  dataType: Type.T;
};

export const C = <DataType>(
  event: Event.T,
  data: DataType,
  dataType: Type.T
): T<DataType> => ({
  ...Ok.C(event),
  type: Ok.Name,
  status: StatusCode.OK,
  data,
  dataType,
});
