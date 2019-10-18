import { pipe } from "fp-ts/lib/pipeable";
import { right, left, map, Either } from "fp-ts/lib/Either";
import { Firestore } from "@google-cloud/firestore";
import { Errors } from "@huckleberryai/core";

export type T = Firestore;

export const C = (): Either<Errors.Environment, Firestore> =>
  pipe(
    process.env.GCLOUD_CREDENTIALS,
    credentials =>
      credentials
        ? right(credentials)
        : left(new Errors.Environment("google cloud service account")),
    map(credentials =>
      JSON.parse(Buffer.from(credentials, "base64").toString())
    ),
    map(
      credentials =>
        new Firestore({
          projectId: credentials.project_id,
          credentials: credentials,
        })
    )
  );