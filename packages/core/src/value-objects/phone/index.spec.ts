import { getExampleNumber, parsePhoneNumber } from "libphonenumber-js";
import {
  Phone,
  IsPhone,
  IsSerializedPhone,
  PhoneSerializer,
  PhoneDeserializer,
} from ".";

const examples = require("libphonenumber-js/examples.mobile.json");

describe("Phone", () => {
  describe("Constructor", () => {
    test("allows valid phone numbers", () => {
      for (let i = 0; i < 100; i++) {
        const phoneNumber = getExampleNumber(i % 2 ? "CA" : "US", examples);
        if (phoneNumber) {
          const phone = Phone(<string>phoneNumber.number);
          expect(phone).toBeTruthy();
        }
      }
    });
    test("disallows invalid phone numbers", () => {
      expect(() => Phone("fakenumber")).toThrow();
      expect(() => Phone("1234567890")).toThrow();
      expect(() => Phone("+1234567890")).toThrow();
    });
  });
  describe("IsPhone", () => {
    test("correctly identifies Phones", () => {
      for (let i = 0; i < 100; i++) {
        const phoneNumber = getExampleNumber(i % 2 ? "CA" : "US", examples);
        if (phoneNumber) {
          const phone = Phone(<string>phoneNumber.number);
          expect(IsPhone(phone)).toBeTruthy();
        }
      }
    });
    test("correctly identifies non-Phones", () => {
      // undefined
      expect(IsPhone(undefined)).toBeFalsy();
      // null
      expect(IsPhone(null)).toBeFalsy();
      // object
      expect(IsPhone({})).toBeFalsy();
      // function
      expect(IsPhone(() => {})).toBeFalsy();
      // number
      expect(IsPhone(4)).toBeFalsy();
      // string
      expect(IsPhone("howdy")).toBeFalsy();
      // boolean
      expect(IsPhone(true)).toBeFalsy();
      // symbol
      expect(IsPhone(Symbol("howdy"))).toBeFalsy();
    });
  });
  describe("IsSerializedPhone", () => {
    test("correctly identifies Phones", () => {
      for (let i = 0; i < 100; i++) {
        const phoneNumber = getExampleNumber(i % 2 ? "CA" : "US", examples);
        if (phoneNumber) {
          const phone = Phone(<string>phoneNumber.number);
          expect(IsSerializedPhone(PhoneSerializer(phone))).toBeTruthy();
        }
      }
    });
    test("correctly identifies non-Phones", () => {
      // undefined
      expect(IsSerializedPhone(undefined)).toBeFalsy();
      // null
      expect(IsSerializedPhone(null)).toBeFalsy();
      // object
      expect(IsSerializedPhone({})).toBeFalsy();
      // function
      expect(IsSerializedPhone(() => {})).toBeFalsy();
      // number
      expect(IsSerializedPhone(4)).toBeFalsy();
      // string
      expect(IsSerializedPhone("howdy")).toBeFalsy();
      // boolean
      expect(IsSerializedPhone(true)).toBeFalsy();
      // symbol
      expect(IsSerializedPhone(Symbol("howdy"))).toBeFalsy();
    });
  });
  describe("PhoneSerializer", () => {
    test("correctly serializes Phones", () => {
      for (let i = 0; i < 100; i++) {
        const phoneNumber = getExampleNumber(i % 2 ? "CA" : "US", examples);
        if (phoneNumber) {
          const phone = Phone(<string>phoneNumber.number);
          expect(IsSerializedPhone(PhoneSerializer(phone))).toBeTruthy();
        }
      }
    });
    test("throws error for non phones", () => {
      const phone = parsePhoneNumber("+1234567890");
      if (phone) {
        expect(() => PhoneSerializer(phone)).toThrow();
      }
    });
  });
  describe("PhoneDeserializer", () => {
    test("correctly de-serializes Phones", () => {
      for (let i = 0; i < 100; i++) {
        const phoneNumber = getExampleNumber(i % 2 ? "CA" : "US", examples);
        if (phoneNumber) {
          const phone = Phone(<string>phoneNumber.number);
          const serialized = PhoneSerializer(phone);
          const deserialized = PhoneDeserializer(serialized);
          expect(IsPhone(deserialized)).toBeTruthy();
        }
      }
    });
    test("throws error on non-Phones", () => {
      // undefined
      expect(() => PhoneDeserializer(undefined)).toThrow();
      // null
      expect(() => PhoneDeserializer(null)).toThrow();
      // object
      expect(() => PhoneDeserializer({})).toThrow();
      // function
      expect(() => PhoneDeserializer(() => {})).toThrow();
      // number
      expect(() => PhoneDeserializer(4)).toThrow();
      // string
      expect(() => PhoneDeserializer("howdy")).toThrow();
      // boolean
      expect(() => PhoneDeserializer(true)).toThrow();
      // symbol
      expect(() => PhoneDeserializer(Symbol("howdy"))).toThrow();
    });
  });
});
