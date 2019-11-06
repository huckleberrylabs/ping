import * as Country from "./country";
import { Env, NonEmptyString } from "@huckleberryai/core";

type PlanMap = {
  [P in Country.T]: NonEmptyString.T;
};

const ProductionPlans: PlanMap = {
  CA: "plan_G80lJAyUlvfQaR" as NonEmptyString.T,
  US: "plan_G80lJAyUlvfQaR" as NonEmptyString.T,
};

const DevPlans: PlanMap = {
  CA: "plan_G80mwTk90AnpYm" as NonEmptyString.T,
  US: "plan_G80mwTk90AnpYm" as NonEmptyString.T,
};

export const Plan = Env.Get() === "production" ? ProductionPlans : DevPlans;

export { Country };
