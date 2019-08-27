import Joi from "@hapi/joi";
import { ID_LENGTH } from "../id";
import {
  DAYS_AVAILABLE_ARRAY,
  TIMES_AVAILABLE_MIN_LENGTH,
  TIMES_AVAILABLE_MAX_LENGTH
} from "./model";

export const showingRequestSchema = Joi.object().keys({
  userID: Joi.string()
    .alphanum()
    .length(ID_LENGTH)
    .required(),
  propertyID: Joi.string()
    .alphanum()
    .length(ID_LENGTH)
    .required(),
  daysAvailable: Joi.array()
    .items(Joi.allow(DAYS_AVAILABLE_ARRAY))
    .required(),
  timesAvailable: Joi.string()
    .min(TIMES_AVAILABLE_MIN_LENGTH)
    .max(TIMES_AVAILABLE_MAX_LENGTH)
    .required(),
  joinees: Joi.array().items(Joi.string().email()),
  createdAt: Joi.date().iso()
});
