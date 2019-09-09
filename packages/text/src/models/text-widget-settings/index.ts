import "@huckleberryai/core/node_modules/libphonenumber-js/types";
import { IsNonNullObject } from "@huckleberryai/core/src/helpers";
import {
  IUUID,
  ISerializedUUID,
  UUID,
  UUIDSerializer,
  UUIDDeserializer,
} from "@huckleberryai/core/src/value-objects/uuid";
import {
  ITypeName,
  ISerializedTypeName,
  TypeName,
  TypeNameSerializer,
  TypeNameDeserializer,
} from "@huckleberryai/core/src/value-objects/type-name";
import {
  IPhone,
  ISerializedPhone,
  PhoneSerializer,
  PhoneDeserializer,
} from "@huckleberryai/core/src/value-objects/phone";
import {
  IColor,
  ISerializedColor,
  Color,
  ColorSerializer,
  ColorDeserializer,
} from "@huckleberryai/core/src/value-objects/color";

const DEFAULT_MAIN_COLOR = "white";
const DEFAULT_ACCENT_COLOR = "#1e73be";

export interface ITextWidgetSettings {
  type: ITypeName;
  id: IUUID;
  phone: IPhone;
  mainColor: IColor;
  accentColor: IColor;
  enabled: boolean;
}

export interface ISerializedTextWidgetSettings {
  type: ISerializedTypeName;
  id: ISerializedUUID;
  phone: ISerializedPhone;
  mainColor: ISerializedColor;
  accentColor: ISerializedColor;
  enabled: boolean;
}

const hasAllProperties = (input: object): boolean => {
  const hasType = "type" in input;
  const hasID = "id" in input;
  const hasPhone = "phone" in input;
  const hasMainColor = "mainColor" in input;
  const hasAccentColor = "accentColor" in input;
  const hasEnabled = "enabled" in input;
  if (
    !hasType ||
    !hasID ||
    !hasPhone ||
    !hasMainColor ||
    !hasAccentColor ||
    !hasEnabled
  ) {
    return false;
  }
  return true;
};

export const IsTextWidgetSettings = (
  input: unknown
): input is ITextWidgetSettings => {
  // Must be Object
  if (!IsNonNullObject(input)) {
    return false;
  }
  if (!hasAllProperties(input)) {
    return false;
  }
  return true;
};

export const IsSerializedTextWidgetSettings = (
  input: unknown
): input is ISerializedTextWidgetSettings => {
  // Must be Object
  if (!IsNonNullObject(input)) {
    return false;
  }
  if (!hasAllProperties(input)) {
    return false;
  }
  return true;
};

export const TextWidgetSettingsName = TypeName("TextWidgetSettings");

export const TextWidgetSettings = (phone: IPhone): ITextWidgetSettings => {
  const textWidgetSettings = {
    type: TextWidgetSettingsName,
    id: UUID(),
    phone: phone,
    mainColor: Color(DEFAULT_MAIN_COLOR),
    accentColor: Color(DEFAULT_ACCENT_COLOR),
    enabled: true,
  };
  return textWidgetSettings;
};

export const TextWidgetSettingsSerializer = (
  input: ITextWidgetSettings
): ISerializedTextWidgetSettings => {
  if (!IsTextWidgetSettings(input)) {
    throw new Error("TextWidgetSettingsSerializer: invalid input");
  }
  return {
    type: TypeNameSerializer(input.type),
    id: UUIDSerializer(input.id),
    phone: PhoneSerializer(input.phone),
    mainColor: ColorSerializer(input.mainColor),
    accentColor: ColorSerializer(input.accentColor),
    enabled: input.enabled,
  };
};

export const TextWidgetSettingsDeserializer = (
  input: unknown
): ITextWidgetSettings => {
  if (!IsSerializedTextWidgetSettings(input)) {
    throw new Error("TextWidgetSettingsDeserializer: invalid input");
  }
  return {
    type: TypeNameDeserializer(input.type),
    id: UUIDDeserializer(input.id),
    phone: PhoneDeserializer(input.phone),
    mainColor: ColorDeserializer(input.mainColor),
    accentColor: ColorDeserializer(input.accentColor),
    enabled: input.enabled,
  };
};
