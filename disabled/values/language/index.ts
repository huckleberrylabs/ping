import Fuse from "fuse.js";
import { Place } from "../place";
import { Languages } from "./data";

export type Language = {
  isoCode: string;
  name: string;
  nativeName: string;
};

export type LanguageDetectionResult = Language & { confidence: number };

export const detectFromPlace = (place: Place): LanguageDetectionResult[] => {
  throw new Error("Not Implemented Yet");
};
export const detectFromText = (text: string): LanguageDetectionResult[] => {
  throw new Error("Not Implemented Yet");
};
export const translate = (text: string, isoCode: string): string => {
  throw new Error("Not Implemented Yet");
};

export const getByName = (name: string): Language[] =>
  new Fuse(Languages, {
    tokenize: true,
    shouldSort: true,
    minMatchCharLength: 3,
    includeScore: true,
    keys: ["name", "nativeName"]
  }).search(name);

export const getByISOCode = (isoCode: string): Language =>
  Languages.filter(language => language.isoCode == isoCode)[0];
