import {
  UUID,
  IUUID,
  ISerializedUUID,
  TypeName,
  ITypeName,
  ISerializedTypeName,
  IsNonNullObject,
} from "@huckleberryai/core";

export interface ITextWidgetSettings {
  type: ITypeName;
  id: IUUID;
  enabled: boolean;
  phone: string;
  mainColor: string;
  accentColor: string;
}

export interface ISerializedTextWidgetSettings {
  type: ISerializedTypeName;
  id: ISerializedUUID;
  enabled: boolean;
  phone: string;
  mainColor: string;
  accentColor: string;
}

export const IsTextWidgetSettings = (
  input: unknown
): input is ITextWidgetSettings => {
  // Must be Object
  if (typeof input !== "object") {
    return false;
  }
  // Must be non-null
  if (!input) {
    return false;
  }
};

export const IsSerializedTextWidgetSettings = (
  input: unknown
): input is ISerializedTextWidgetSettings => {
  // Must be Object
  if (!IsNonNullObject(input)) {
    return false;
  }
};

export const TextWidgetSettingsName = TypeName("TextWidgetSettings");

export const TextWidgetSettings = (phone: string): ITextWidgetSettings => {
  const textWidgetSettings = {
    id: UUID(),
    enabled: true,
    phone: phone,
    mainColor: "white",
    accentColor: "#1e73be",
  };
  return textWidgetSettings;
};

export const TextWidgetSettingsSerializer = (
  input: ITextWidgetSettings
): ISerializedTextWidgetSettings => {};
export const TextWidgetSettingsDeserializer = (
  input: unknown
): ITextWidgetSettings => {};
