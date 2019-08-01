import disposable from "disposable-email";
import freemail from "freemail";
import validator from "validator";
import fs from "fs";
import {
  IResource,
  ISerializable,
  IValidatable,
  IVerifiable,
  ResourceMeta
} from "../Resource";
//missing folder Resource
const genericAccountArray = fs
  .readFileSync("genericAccounts.txt")
  .toString()
  .split("\n");
const genericDomainArray = fs
  .readFileSync("genericDomains.txt")
  .toString()
  .split("\n");
export type SerializedEmail = {
  type: string;
  id: string;
  email: string;
  isGenericAccount?: boolean;
  isGenericDomain?: boolean;
  isDisposableDomain?: boolean;
  isValidated?: boolean;
  validationError?: string;
};

export interface IEmail {
  email: string;
  isGenericAccount(): boolean;
  isGenericDomain(): boolean;
  isDisposableDomain(): boolean;
}
export default class Email
  implements
    IResource,
    ISerializable<SerializedEmail>,
    IValidatable,
    IVerifiable,
    IEmail {
  public methods: any;
  email!: string;
  isValidated!: boolean;
  validationError!: string;
  constructor(from: "serialized" | "email", input: SerializedEmail) {
    if (from === "serialized") {
      this.deserialize(input);
    } else if (from === "email") {
      this.email = validator.normalizeEmail(input.email);
    }
  }
  get meta(): ResourceMeta {
    return {
      type: this.type,
      id: this.id,
      methods: this.methods
    };
  }
  get type(): string {
    return Email.type;
  }
  get id(): string {
    return `mailto:${this.email}`;
  }
  get isGenericAccount(): any {
    return genericAccountArray.includes(this.email.split("@")[0]);
  }
  get isGenericDomain(): any {
    return (
      genericDomainArray.includes(this.email.split("@")[1]) ||
      freemail.isFree(this.email)
    );
  }
  get isDisposableDomain(): any {
    return freemail.isDisposable(this.email) || disposable.validate(this.email);
  }
  get serialize(): SerializedEmail {
    return {
      type: this.type,
      id: this.id,
      email: this.email,
      isValidated: this.isValidated,
      validationError: this.validationError,
      isGenericAccount: this.isGenericAccount(),
      isGenericDomain: this.isGenericDomain(),
      isDisposableDomain: this.isDisposableDomain()
    };
  }
  deserialize(input: SerializedEmail): void {
    this.email = input.email;
    this.isValidated = input.isValidated;
    this.validationError = input.validationError;
    this.isGenericAccount = input.isGenericAccount; //from missing folder
    this.isGenericDomain = input.isGenericDomain;
    this.isDisposableDomain = input.isDisposableDomain;
  }
  validate(): void {
    this.isValidated = validator.isEmail(this.email);
  }
  verify(): void {
    /* 

    Verification Strategy:
    0. Check against stored SendGrid Data.
    1. Domain exists?
    2. MX records exist?
    3. Send an email to the address that:
      - is vague
      - elicits a response
      - includes a tracking pixel
      - avoids being marked as spam
    4. Adds email to email:activity set cache
    
    Once the email is sent, a tracking server monitors
    Sendgrids Event and Parse Webhooks, storing them in the cache.

    If a affirmative event occurs, the graph is updated with the relevant info.
    this includes extracting Entities and updating verification from replies.

    Email Class will include derived properties based on Activity.
    */
  }
}
Email.type = "Email";
Email.id = "email";
Email.methods = {
  validate: {
    name: "validate",
    version: 1.0
  },
  verify: {
    name: "verify",
    version: 1.0
  }
};
