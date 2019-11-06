import * as UseCases from "./use-cases";
export { UseCases };
export * from "./entity";

export type Names = UseCases.Names; // dont include ping:message because its event sourced and never serialized
