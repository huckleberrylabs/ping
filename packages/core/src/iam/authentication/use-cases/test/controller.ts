import { Request, Response } from "express";
import { StatusCode } from "../../../../values";

export default () => async (req: Request, res: Response) => {
  res.status(StatusCode.OK).send();
};
