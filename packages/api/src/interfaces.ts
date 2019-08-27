import { IResult, IEvent } from "@huckleberryai/core";

export type aggregator = (events: IEvent[]) => IResult;
export type handle = (event: IEvent) => Promise<IResult>;
export type emit = (event: IEvent) => Promise<IResult>;
export type deserialize = (json: any) => Promise<IResult>;

export type fromJSON = (json: any) => IResult;
export type repository = (...args: any) => Promise<IResult>;
