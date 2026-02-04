import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.header("authorization");
  if (!authHeader) {
    res.status(401).json({ error: "Missing authorization header" });
    return;
  }

  const [scheme, token] = authHeader.split(" ");
  if (scheme !== "Bearer" || !token) {
    res.status(401).json({ error: "Invalid authorization header" });
    return;
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as { id: string; email: string };
    req.user = { id: payload.id, email: payload.email };
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};
