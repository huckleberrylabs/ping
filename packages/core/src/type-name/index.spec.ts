import {
  TypeName,
  IsTypeName,
  IsSerializedTypeName,
  TypeNameSerializer,
  TypeNameDeserializer,
} from ".";

describe("TypeName", () => {
  describe("Constructor", () => {
    test("Generates a TypeName", () => {
      const typeName = TypeName("TestName");
      expect(typeName).toBeTruthy();
    });
    test("identical input strings produce same TypeName", () => {
      for (let i = 0; i < 100; i++) {
        const typeName1 = TypeName(`TestName + ${i}`);
        const typeName2 = TypeName(`TestName + ${i}`);
        expect(typeName1).toStrictEqual(typeName2);
      }
    });
    test("differing input strings produce different TypeNames", () => {
      for (let i = 0; i < 100; i++) {
        const typeName1 = TypeName(`TestName + ${i}`);
        const typeName2 = TypeName(`DifferentTestName + ${i}`);
        expect(typeName1 === typeName2).toBeFalsy();
      }
    });
    test("Empty string input does not produce a TypeName", () => {
      expect(() => TypeName("")).toThrow();
    });
  });
  describe("IsTypeName", () => {
    test("TypeNames are TypeNames", () => {
      expect(IsTypeName(TypeName("howdy"))).toBeTruthy();
    });
    test("SerializedTypeNames are not TypeNames", () => {
      const serialized = TypeNameSerializer(TypeName("howdy"));
      expect(IsTypeName(serialized)).toBeFalsy();
    });
    test("Global Symbols are TypeNames", () => {
      expect(IsTypeName(Symbol.for("howdy"))).toBeTruthy();
    });
    test("Symbols are not TypeNames", () => {
      expect(IsTypeName(Symbol("howdy"))).toBeFalsy();
    });
    test("Other Primitives are not TypeNames", () => {
      // string
      expect(IsTypeName("howdy")).toBeFalsy();
      // number
      expect(IsTypeName(4)).toBeFalsy();
      // boolean
      expect(IsTypeName(true)).toBeFalsy();
      // object
      expect(IsTypeName({})).toBeFalsy();
      // function
      expect(IsTypeName(() => {})).toBeFalsy();
      // null
      expect(IsTypeName(null)).toBeFalsy();
      // undefined
      expect(IsTypeName(undefined)).toBeFalsy();
    });
  });
  describe("IsSerializedTypeName", () => {
    test("SerializedTypeNames are SerializedTypeNames", () => {
      const serialized = TypeNameSerializer(TypeName("howdy"));
      expect(IsSerializedTypeName(serialized)).toBeTruthy();
    });
    test("TypeNames are not SerializedTypeNames", () => {
      expect(IsSerializedTypeName(TypeName("howdy"))).toBeFalsy();
    });
    test("Other Primitives are not TypeNames", () => {
      // number
      expect(IsSerializedTypeName(4)).toBeFalsy();
      // boolean
      expect(IsSerializedTypeName(true)).toBeFalsy();
      // object
      expect(IsSerializedTypeName({})).toBeFalsy();
      // function
      expect(IsSerializedTypeName(() => {})).toBeFalsy();
      // null
      expect(IsSerializedTypeName(null)).toBeFalsy();
      // undefined
      expect(IsSerializedTypeName(undefined)).toBeFalsy();
    });
  });
  describe("TypeNameSerializer", () => {
    test("Serializes Type Names", () => {
      const typeName = TypeName("howdy");
      const serialized = TypeNameSerializer(typeName);
      expect(IsSerializedTypeName(serialized)).toBeTruthy();
    });
    test("Throw Errors for non Type Names", () => {
      expect(() => TypeNameSerializer(Symbol(""))).toThrow();
    });
  });
  describe("TypeNameDeserializer", () => {
    test("Deserializes Type Names", () => {
      const typeName = TypeName("howdy");
      const serialized = TypeNameSerializer(typeName);
      const deserialized = TypeNameDeserializer(serialized);
      expect(IsTypeName(deserialized)).toBeTruthy();
    });
    test("Throws Error on non TypeNames", () => {
      // number
      expect(() => TypeNameDeserializer(4)).toThrow();
      // boolean
      expect(() => TypeNameDeserializer(true)).toThrow();
      // object
      expect(() => TypeNameDeserializer({})).toThrow();
      // function
      expect(() => TypeNameDeserializer(() => {})).toThrow();
      // null
      expect(() => TypeNameDeserializer(null)).toThrow();
      // undefined
      expect(() => TypeNameDeserializer(undefined)).toThrow();
    });
  });
});
