import { RequestHandler } from "express";
import core from "express-serve-static-core";

export function expressAsyncHandler<
  P = core.ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = core.Query
>(
  handler: (
    ...args: Parameters<RequestHandler<P, ResBody, ReqBody, ReqQuery>>
  ) => void | Promise<void>
): RequestHandler<P, ResBody, ReqBody, ReqQuery> {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}
