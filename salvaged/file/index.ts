import fileType from "file-type";

type FileMetaData = {
  extension: string;
  mimeType: string;
};

export function getFileMetaData(file: Buffer): FileMetaData {
  const fileTypeResult = fileType(file);
  if (fileTypeResult) {
    return {
      extension: fileTypeResult.ext,
      mimeType: fileTypeResult.mime
    };
  } else {
    throw new Error("File Invalid");
  }
}
