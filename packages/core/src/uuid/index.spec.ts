import {
  LENGTH,
  UUID,
  IsUUID,
  IsSerializedUUID,
  UUIDSerializer,
  UUIDDeserializer,
} from ".";

describe("UUID", () => {
  describe("Constructor", () => {
    test("outputs id of exact length", () => {
      for (let i = 0; i < 100; i++) {
        const id = UUID();
        expect(id).toHaveLength(LENGTH);
      }
    });
    test("outputs unique ids", () => {
      const idArray = [];
      for (let i = 0; i < 100; i++) {
        const id = UUID();
        expect(idArray.includes(id)).toBeFalsy();
        idArray.push(id);
      }
    });
    test("accepts valid length string", () => {
      let str = "";
      for (let i = 1; i <= LENGTH; i++) {
        str = str + "a";
      }
      expect(UUID(str)).toHaveLength(LENGTH);
    });
    test("disallows invalid length string", () => {
      let str = "";
      // Too Short
      for (let i = 1; i <= LENGTH - 1; i++) {
        str = str + "a";
      }
      expect(() => UUID(str)).toThrow();
      // Too Long
      for (let i = 1; i <= LENGTH + 1; i++) {
        str = str + "a";
      }
      expect(() => UUID(str)).toThrow();
    });
  });
  describe("IsUUID", () => {
    test("correctly identifies UUIDs", () => {
      for (let i = 0; i < 100; i++) {
        const id = UUID();
        expect(IsUUID(id)).toBeTruthy();
      }
    });
    test("correctly identifies non-UUIDs", () => {
      // undefined
      expect(IsUUID(undefined)).toBeFalsy();
      // null
      expect(IsUUID(null)).toBeFalsy();
      // object
      expect(IsUUID({})).toBeFalsy();
      // function
      expect(IsUUID(() => {})).toBeFalsy();
      // number
      expect(IsUUID(4)).toBeFalsy();
      // string
      expect(IsUUID("howdy")).toBeFalsy();
      // boolean
      expect(IsUUID(true)).toBeFalsy();
      // symbol
      expect(IsUUID(Symbol("howdy"))).toBeFalsy();
    });
    expect(true).toBeTruthy();
  });
  describe("IsSerializedUUID", async () => {
    test("correctly identifies UUIDs", () => {
      for (let i = 0; i < 100; i++) {
        const id = UUID();
        expect(IsSerializedUUID(UUIDSerializer(id))).toBeTruthy();
      }
    });
    test("correctly identifies non-UUIDs", () => {
      // undefined
      expect(IsSerializedUUID(undefined)).toBeFalsy();
      // null
      expect(IsSerializedUUID(null)).toBeFalsy();
      // object
      expect(IsSerializedUUID({})).toBeFalsy();
      // function
      expect(IsSerializedUUID(() => {})).toBeFalsy();
      // number
      expect(IsSerializedUUID(4)).toBeFalsy();
      // string
      expect(IsSerializedUUID("howdy")).toBeFalsy();
      // boolean
      expect(IsSerializedUUID(true)).toBeFalsy();
      // symbol
      expect(IsSerializedUUID(Symbol("howdy"))).toBeFalsy();
    });
    expect(true).toBeTruthy();
  });
  describe("UUIDSerializer", async () => {
    test("correctly serializes UUIDs", () => {
      for (let i = 0; i < 100; i++) {
        const id = UUID();
        expect(IsSerializedUUID(UUIDSerializer(id))).toBeTruthy();
      }
    });
    test("throws error for non UUIDs", () => {
      let str = "";
      // Too Short
      for (let i = 1; i <= LENGTH - 1; i++) {
        str = str + "a";
      }
      expect(() => UUIDSerializer(str)).toThrow();
      // Too Long
      for (let i = 1; i <= LENGTH + 1; i++) {
        str = str + "a";
      }
      expect(() => UUIDSerializer(str)).toThrow();
    });
  });
  describe("UUIDDeserializer", async () => {
    test("correctly de-serializes UUIDs", () => {
      for (let i = 0; i < 100; i++) {
        const id = UUID();
        const serialized = UUIDSerializer(id);
        const deserialized = UUIDDeserializer(serialized);
        expect(IsUUID(deserialized)).toBeTruthy();
      }
    });
    test("throws error on non-UUIDs", () => {
      // undefined
      expect(() => UUIDDeserializer(undefined)).toThrow();
      // null
      expect(() => UUIDDeserializer(null)).toThrow();
      // object
      expect(() => UUIDDeserializer({})).toThrow();
      // function
      expect(() => UUIDDeserializer(() => {})).toThrow();
      // number
      expect(() => UUIDDeserializer(4)).toThrow();
      // string
      expect(() => UUIDDeserializer("howdy")).toThrow();
      // boolean
      expect(() => UUIDDeserializer(true)).toThrow();
      // symbol
      expect(() => UUIDDeserializer(Symbol("howdy"))).toThrow();
    });
  });
});
