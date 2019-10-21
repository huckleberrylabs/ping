import * as iots from "io-ts";
import * as Event from "../../event";
import * as Result from "../../result";
import { Type, StatusCode } from "../../values";

export const Name = "core:result:ok-with-data";

export const Codec = <DataCodec extends iots.Mixed>(codec: DataCodec) =>
  iots.intersection(
    [
      iots.interface({
        type: iots.literal(Name),
        status: iots.literal(StatusCode.OK),
        data: codec,
        dataType: Type.Codec,
      }),
      Result.Codec,
    ],
    Name
  );

export type T<DataType> = Result.T & {
  type: typeof Name;
  status: typeof StatusCode.OK;
  data: DataType;
  dataType: Type.T;
};

export const C = <DataType>(
  event: Event.T,
  data: DataType,
  dataType: Type.T
): T<DataType> => ({
  ...Result.C(event),
  type: Name,
  status: StatusCode.OK,
  data,
  dataType,
});
