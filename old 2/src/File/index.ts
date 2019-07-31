import fileType from "file-type";
import {
  IResource,
  ISerializable,
  ResourceMeta
  // @ts-ignore
} from "../Resource";
// @ts-ignore
import { IFactories } from "../Factories";

export type SerializedFile = {
  type?: string;
  id?: string;
  metaData?: {
    fileType?: string;
    mimeType?: string;
    fileName?: string;
    url?: string;
  };
  file?: Buffer;
};
export default class File implements IResource, ISerializable<SerializedFile> {
  url: any;
  initialize() {
    throw new Error("Method not implemented.");
  }
  _id!: string;
  fileType!: string;
  mimeType!: string;
  type: any;
  fileName: any;
  retriever: any;
  constructor(serializedFile: SerializedFile, factories: IFactories) {
    const { metaData } = serializedFile.metaData;
    if (metaData) {
      this.fileName = metaData.fileName;
      this.url = metaData.url;
      if (!serializedFile.file && this.url) {
        this.retriever = factories.retriever.get(this.type);
        this.initialize();
      }
    }
    if (!metaData.fileType || !metaData.mimeType) {
      const { ext, mime } = fileType(serializedFile.file);
      this.fileType = ext;
      this.mimeType = mime;
    }
  }
}
