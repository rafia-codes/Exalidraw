import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

export function verifyUser(req: Request, res: Response, next: NextFunction) {
  const token = req.headers["authorization"] ?? "";
  const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
  if (payload) {
    (req as any).userId = payload.id;
    next();
  } else {
    res.status(403).json({ message: "Unauthorized" });
  }
}
