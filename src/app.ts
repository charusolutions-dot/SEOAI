import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import routes from "./routes";

export const createApp = () => {
  const app = express();
  app.use(express.json());
  app.use(morgan("combined"));

  app.use(routes);

  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof Error) {
      const status = (err as Error & { status?: number }).status ?? 400;
      res.status(status).json({ error: err.message });
      return;
    }

    res.status(500).json({ error: "Internal server error" });
  });

  return app;
};
