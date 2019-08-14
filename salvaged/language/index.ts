import { IPlace } from "imaginary";
import { Languages } from "./data";
import Fuse from "fuse.js";

export type Language = {
  isoCode: string;
  name: string;
  nativeName: string;
};

export type LanguageDetectionResult = Language & { confidence: number };

export interface ILanguageService {
  getByISOCode(isoCode: string): Language;
  getByName(name: string): Language[];
  detectFromPlace(place: IPlace): LanguageDetectionResult[];
  detectFromText(text: string): LanguageDetectionResult[];
  translate(text: string, isoCode: string): string;
}

export class LanguageService implements ILanguageService {
  getByISOCode(isoCode: string): Language {
    return Languages.filter(language => language.isoCode === isoCode)[0];
  }
  getByName(name: string): Language[] {
    const options: Fuse.FuseOptions<Language> = {
      tokenize: true,
      shouldSort: true,
      minMatchCharLength: 3,
      includeScore: true,
      keys: ["name", "nativeName"]
    };
    const fuse = new Fuse(Languages, options);
    return fuse.search(name);
  }
  detectFromPlace(place: IPlace): LanguageDetectionResult[] {
    throw new Error("Not Implemented Yet");
  }
  detectFromText(text: string): LanguageDetectionResult[] {
    throw new Error("Not Implemented Yet");
  }
  translate(text: string, isoCode: string): string {
    throw new Error("Not Implemented Yet");
  }
}
