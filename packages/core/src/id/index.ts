import uuid from "uuid/v4";

export class ID {
  private MIN_LENGTH: number = 32;
  private _id: string;
  constructor(value?: string) {
    if (value && value.length < this.MIN_LENGTH) {
      throw new Error(
        `ID string must have a minimum of length of ${this.MIN_LENGTH}. Value provided has a length of ${value.length}`
      );
    } else if (value && value.length >= this.MIN_LENGTH) {
      this._id = value;
    } else {
      this._id = uuid();
    }
  }
  equals(id: ID) {
    return id._id === this._id;
  }
  toString(): string {
    return this._id;
  }
}
