import { injectable } from "inversify";
import { Datastore } from "@google-cloud/datastore";

@injectable()
export class DataStore {
  public store: Datastore;
  constructor() {
    const gCloudCredentialString = process.env.GCLOUD_CREDENTIALS;
    if (!gCloudCredentialString) {
      throw new Error("Google Cloud Service Account Key is required");
    }
    const GCLOUD_CREDENTIALS = JSON.parse(
      Buffer.from(gCloudCredentialString, "base64").toString()
    );
    this.store = new Datastore({
      projectId: GCLOUD_CREDENTIALS.project_id,
      credentials: GCLOUD_CREDENTIALS,
    });
  }
}
