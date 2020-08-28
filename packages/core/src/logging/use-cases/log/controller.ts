import { Request, Response, NextFunction } from "express";
import { Logger } from "../..";

export default () => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.on("finish", () => {
    Logger(
      "HTTP",
      "info",
      `${req.method} ${req.originalUrl || req.url} ${res.statusCode}`
    );
  });
  next();
};
