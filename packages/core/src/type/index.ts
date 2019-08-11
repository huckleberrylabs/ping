import { WithSerialize } from "../interfaces";

export class Type implements WithSerialize {
  private _type: symbol;
  constructor(name: string) {
    if (name.length == 0) {
      throw new Error("Type Name must be provided");
    }
    this._type = Symbol.for(name);
  }
  equals(type: Type) {
    return type._type === this._type;
  }
  toString(): string {
    const string = Symbol.keyFor(this._type);
    if (!string) {
      throw new Error("Symbol doesnt exist in global registry");
    }
    return string;
  }
  toSymbol(): symbol {
    return this._type;
  }
  toJSON() {
    return this.toString();
  }
}
