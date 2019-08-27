import express from "express";
import { ShowingRequestController } from "../domain/showing-request/controller";
import { SHOWING_REQUEST_NAME } from "../domain/showing-request/name";

const router = express.Router();

router.get("/ping", (req, res) => {
  res.status(200).send("API Works");
});

router.post("/" + SHOWING_REQUEST_NAME, ShowingRequestController.create);

export { router };
