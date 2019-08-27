import { Request, Response } from "express";
import { sendMail, logger } from "../../utilities";
import { UserRepository as userRepo } from "../user/repository";
import { PropertyRepository as propertyRepo } from "../property/repository";

import { ShowingRequest } from "./model";
import { showingRequestSchema as showingsSchema } from "./validator";
import { ShowingRequestRepository as showingsRepo } from "./repository";
import { showingRequestCreatedEmail } from "./emails";

export class ShowingRequestController {
  static async create(req: Request, res: Response) {
    try {
      logger("info", "Creating a Showing Request");
      const data: ShowingRequest = req.body;

      // Validate the Data Transfer Object
      const validated = showingsSchema.validate(data);
      if (validated.error) {
        res.status(400).send(validated.error.message);
        return;
      }

      // Validate User ID
      const user = await userRepo.getByID(data.userID);
      if (!user) {
        res.status(400).send("User doesn't exist");
        return;
      }

      // INSERT AUTHORIZATION CHECK CODE ON JWT HERE

      // Validate Property ID
      const property = await propertyRepo.getByID(data.propertyID);
      if (!property) {
        res.status(400).send("Property doesn't exist");
        return;
      }

      // Check if a ShowingRequest already exists for the given Property and User
      const userShowings = await showingsRepo.getAllByUserID(user.id);
      const propertyShowingAlreadyExists =
        userShowings.filter(showing => showing.propertyID === data.propertyID)
          .length > 0;
      if (propertyShowingAlreadyExists) {
        res
          .status(400)
          .send(
            `A showing has already been requested. please check your inbox at ${
              user.email
            }.`
          );
        return;
      }

      // Add ShowingRequest to Repository and send an email to all parties involved
      data.createdAt = new Date().toISOString();
      const email = showingRequestCreatedEmail(
        user.email,
        user.firstName,
        data.joinees,
        property.address,
        data.daysAvailable,
        data.timesAvailable
      );
      await showingsRepo.add(data);
      await sendMail(email);

      // Respond with the newly created Entity (standard RESTful practice)
      res.status(200).send(data);
    } catch (error) {
      logger("error", error);
      res
        .status(500)
        .send(
          "Houston, we have a problem. Our Engineers have been notified, please try again later."
        );
    }
  }
}
