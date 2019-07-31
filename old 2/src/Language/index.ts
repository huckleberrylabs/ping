import {
  IResource,
  ISerializable,
  IValidatable,
  ResourceMeta
  // @ts-ignore
} from "../Resource";
import { IPlace } from "../Place";
import { LanguageMap, ISOCodes } from "./data";
// @ts-ignore
import Normalize from "../Normalize";

const LanguageCodes = Object.keys(LanguageMap);
const LanguageNames = Object.values(LanguageMap); //add "es2017.object for lib in tsconfig.json"
const ReverseLanguageMap = {};
LanguageCodes.forEach(key => {
  const language = (LanguageMap as any)[key];
  let names = [];
  names.push(...language.name.split(/[,;]/));
  names.push(...language.nativeName.split(/[,;]/));
  names = names.map(name => Normalize.whiteSpace(name));
  names = names.map(name => Normalize.string(name));
  names = Normalize.uniqueStringArray(names);
  names.forEach((name: any) => ((ReverseLanguageMap as any)[name] = key));
});
export type SerializedLanguage = {
  type: string;
  id: ISOCodes;
  name: string;
  isValidated?: boolean;
  validationError?: string;
};
export interface ILanguage {
  name(): string;
  translate(input: string): string;
}
export default class Language
  implements
    IResource,
    ISerializable<SerializedLanguage>,
    IValidatable,
    ILanguage {
  name: string;
  _id: ISOCodes;
  isValidated!: boolean;
  validationError!: string;
  isValid!: boolean;
  constructor(
    from: "serialized" | "name" | "ISOCode" | "place" | "text",
    input: SerializedLanguage | IPlace | string
  ) {
    if (from === "serialized") {
      this.deserialize(input);
    } else if (from === "name") {
      this.name = Normalize.whiteSpace(Normalize.string(input.name));
      this._id = (ReverseLanguageMap as any)[this.name];
    } else if (from === "ISOCode") {
      this._id = Normalize.whiteSpace(Normalize.string(input.id));
    } else if (from === "place") {
      this.fromPlace(input);
    } else if (from === "text") {
      this.fromText(input);
    }
  }
  get meta(): ResourceMeta {
    return {
      type: this.type,
      id: this.id,
      methods: Language.methods:
    };
  }
  get type(): string {
    return Language.type;
  }
  get id(): string {
    return this._id;
  }
  get name(): string {
    return (LanguageMap as any)[this.id].name;
  }
  get serialize(): SerializedLanguage {
    return {
      type: this.type,
      id: this.id,
      name: this.name,
      isValidated: this.isValid,
      validationError: this.validationError
    };
  }
  deserialize(input: SerializedLanguage): void {
    this._id = input.id;
    this.name = input.name;
    this.isValidated = input.isValidated;
    this.validationError = input.validationError;
  }
  validate(): void {
    this.isValidated =
      LanguageCodes.includes(this.id) || ReverseLanguageMap.includes(this.name);
    if (!this.isValidated) {
      if (!LanguageCodes.includes(this.id)) {
        this.validationError = `Unrecognized ISO Code: ${this.id}`;
      }
      if (!ReverseLanguageMap.includes(this.name)) {
        this.validationError = `Unrecognized Name: ${this.id}`;
      }
    }
  }
  fromPlace(input: IPlace): void {
    throw new Error("Not Implemented Yet");
  }
  fromText(input: string): void {
    throw new Error("Not Implemented Yet");
  }
  translate(input: string): string {
    throw new Error("Not Implemented Yet");
  }
}
Language.type = "Language";
Language.id = "lang";
Language.methods = {
  validate: {
    name: "validate",
    version: 1.0
  }
};
