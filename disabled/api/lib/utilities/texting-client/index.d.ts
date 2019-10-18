import { Either } from "fp-ts/lib/Either";
import * as iots from "io-ts";
import { Phone, NonEmptyString, Errors } from "@huckleberryai/core";
export declare const TwilioClient: () => Either<Errors.Environment, (body: iots.Branded<string, NonEmptyString.Brand>, to: iots.Branded<string, Phone.Brand>) => Promise<import("twilio/lib/rest/api/v2010/account/message").MessageInstance>>;
//# sourceMappingURL=index.d.ts.map