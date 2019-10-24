import * as UseCases from "./use-cases";
import * as Entity from "./entity";
export { UseCases };
export * from "./entity";

export type Names = UseCases.Names | typeof Entity.Name;
