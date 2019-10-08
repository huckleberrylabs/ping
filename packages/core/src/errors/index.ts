import { Type } from "../values";

export class ValidationError extends Error {
  name = "core:error:validation" as Type;
}
export class ParsingError extends Error {
  name = "core:error:parsing" as Type;
}

export class HTTPError extends Error {
  name = "core:error:http" as Type;
}

export class EnvironmentError extends Error {
  name = "core:error:environment" as Type;
}
