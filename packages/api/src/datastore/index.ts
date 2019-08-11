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
    const gcloudCredentials = JSON.parse(atob(gCloudCredentialString));
    this.store = new Datastore({
      projectId: gcloudCredentials.project_id,
      credentials: {
        client_email: gcloudCredentials.client_email,
        private_key: gcloudCredentials.private_key,
      },
    });
  }
}
