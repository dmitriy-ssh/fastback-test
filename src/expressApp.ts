import express from "express";
import {
  IRequestHandler,
  ScrapResultError,
  ScrapResultErrorType,
} from "./types";

const isValidQueryString = (query: unknown) => {
  return typeof query === "string";
};

export function setupController(handler: IRequestHandler) {
  const app = express();

  app.get("/parse", async (req, res) => {
    const queryProductId = req.query["productId"];
    const queryHandleId = req.query["handleId"];

    if (queryProductId && queryHandleId) {
      res.status(400).json({});
      return;
    }

    if (isValidQueryString(queryProductId)) {
      const result = await handler.handleProductRequest(
        queryProductId as string
      );

      result
        ? res.status(200).json({ handleId: result })
        : res.status(400).json({});

      return;
    }

    if (isValidQueryString(queryHandleId)) {
      const result = await handler.handleProductScrapResultRequest(
        queryHandleId as string
      );

      const scrapError = result as ScrapResultError;

      if (!scrapError.error) {
        res.status(200).json({ result });
        return;
      }

      res.status(202).json({ error: scrapError.error });
      return;
    }

    res.status(400).json({});
  });

  return app;
}
