import fileType from "file-type";
import {
  type IResource,
  type ISerializable,
  type ResourceMeta
} from "../Resource";
import { type IFactories } from "../Factories";

export type SerializedFile = {
  type?: string,
  id?: string,
  metaData?: {
    fileType?: string,
    mimeType?: string,
    fileName?: string,
    url?: string
  },
  file?: Buffer
};
export default class File implements IResource, ISerializable<SerializedFile> {
  _id: string;
  fileType: string;
  mimeType: string;
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
