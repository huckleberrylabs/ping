import fs from "fs";

//@ts-ignore
import disposable from "disposable-email";
//@ts-ignore
import freemail from "freemail";
import validator from "validator";

const genericAccountArray = fs
  .readFileSync("genericAccounts.txt")
  .toString()
  .split("\n");
const genericDomainArray = fs
  .readFileSync("genericDomains.txt")
  .toString()
  .split("\n");

interface IEmailService {
  isGenericAccount(email: string): boolean;
  isGenericDomain(email: string): boolean;
  isDisposableDomain(email: string): boolean;
  normalize(email: string): string;
  validate(email: string): boolean;
  verify(email: string): Promise<void>;
}

export class EmailService implements IEmailService {
  isGenericAccount(email: string): boolean {
    return genericAccountArray.includes(email.split("@")[0]);
  }
  isGenericDomain(email: string): boolean {
    return (
      genericDomainArray.includes(email.split("@")[1]) || freemail.isFree(email)
    );
  }
  isDisposableDomain(email: string): boolean {
    return freemail.isDisposable(email) || disposable.validate(email);
  }
  normalize(email: string): string {
    const result = validator.normalizeEmail(email);
    if (typeof result !== "string") {
      throw new Error("Not A Valid Email");
    } else {
      return result;
    }
  }
  validate(email: string): boolean {
    return validator.isEmail(email);
  }
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
  async verify(): Promise<void> {
    throw new Error("Not Implemented Yet!");
  }
}
