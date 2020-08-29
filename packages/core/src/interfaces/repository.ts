import { Either } from "fp-ts/lib/Either";
import { UUID, Errors } from "../values";

export type Add<Model> = (
  entity: Model
) => Promise<Either<Errors.Adapter.T | Errors.Validation.T, null>>;

export type GetByID<Model> = (
  id: UUID.T
) => Promise<Either<Errors.Adapter.T | Errors.NotFound.T, Model>>;

export type Remove = (
  id: UUID.T
) => Promise<Either<Errors.Adapter.T | Errors.NotFound.T, null>>;

export type Update<Model> = (
  entity: Model
) => Promise<Either<Errors.Adapter.T | Errors.NotFound.T, null>>;

export type Exists = (
  id: UUID.T
) => Promise<Either<Errors.Adapter.T | Errors.NotFound.T, null>>;

export interface IRepository<Model> {
  add: Add<Model>;
  get: GetByID<Model>;
  remove: Remove;
  update: Update<Model>;
  exists: Exists;
}
