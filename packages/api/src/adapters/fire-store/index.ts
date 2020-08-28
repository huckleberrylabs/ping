import { pipe } from "fp-ts/lib/pipeable";
import { right, left, map, tryCatch, isLeft, Either } from "fp-ts/lib/Either";
import { Firestore } from "@google-cloud/firestore";
import { Errors, NameSpaceCaseString } from "@huckleberrylabs/ping-core";

export const Name = "adapters:firestore" as NameSpaceCaseString.T;
export type T = Firestore;
export const GetCredentials = () =>
  pipe(
    process.env.GCLOUD_CREDENTIALS,
    credentials =>
      credentials
        ? right(credentials)
        : left(Errors.Environment.C(Name, "GCLOUD_CREDENTIALS is missing")),
    map(credentials =>
      JSON.parse(Buffer.from(credentials, "base64").toString())
    )
  );

export const C = (): Either<Errors.Adapter.T | Errors.Environment.T, T> => {
  const maybeCredentials = GetCredentials();
  if (isLeft(maybeCredentials)) return maybeCredentials;
  const credentials = maybeCredentials.right;
  return tryCatch(
    () =>
      new Firestore({
        projectId: credentials.project_id,
        credentials: credentials,
      }),
    () => Errors.Adapter.C(Name, "Constructor")
  );
};
