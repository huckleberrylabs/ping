import jwt from "jsonwebtoken";
import { right } from "fp-ts/lib/Either";
import { Results } from "@huckleberryai/core";
import * as Interfaces from "../interfaces";

export const IAMService = (
  recordRepo: Interfaces.RecordRepository,
  policyRepo: Interfaces.PolicyRepository
) => (privateKey: string): Interfaces.IAMService => ({
  async isAuthenticated(event, token) {
    return right(Results.OK.C(event));
  },
  authenticate(agent) {
    return jwt.sign({ agent }, privateKey);
  },
  async sign(event, agent) {
    return right(Results.OK.C(event));
  },
  async verify(event, agent) {
    return right(Results.OK.C(event));
  },
  async isAuthorized(event, agent, entity) {
    return right(Results.OK.C(event));
  },
  async grantAuthorization(event, agent, entity) {
    return right(Results.OK.C(event));
  },
});
