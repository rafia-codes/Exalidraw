import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from "@repo/backend-common/config";

export function verifyUser(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies["token"];
    console.log(req.cookies);
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
    if (payload) {
      (req as any).userId = payload.id;
      next();
    } else {
      res.status(403).json({ message: "Unauthorized" });
    }
  } catch (error: any) {
    console.log(error.message);
  }
}
