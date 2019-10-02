import { injectable } from "inversify";
import { Firestore } from "@google-cloud/firestore";

@injectable()
export class DocumentStore {
  public store: Firestore;
  constructor() {
    const gCloudCredentialString = process.env.GCLOUD_CREDENTIALS;
    if (!gCloudCredentialString) {
      throw new Error("Google Cloud Service Account Key is required");
    }
    const GCLOUD_CREDENTIALS = JSON.parse(
      Buffer.from(gCloudCredentialString, "base64").toString()
    );
    this.store = new Firestore({
      projectId: GCLOUD_CREDENTIALS.project_id,
      credentials: GCLOUD_CREDENTIALS,
    });
  }
}
