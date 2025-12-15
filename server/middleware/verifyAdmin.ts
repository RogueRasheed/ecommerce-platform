import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  id: string;
  username: string;
}

export default function verifyAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("❌ No token provided");
      return res.status(401).json({ message: "Access denied, token missing" });
    }

    const token = authHeader.split(" ")[1];
    console.log("🪪 Received token:", token);

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET not configured");
    }

    const decoded = jwt.verify(token, secret) as JwtPayload;
    console.log("✅ Decoded token:", decoded);

    if (decoded.username !== "admin") {
      console.log("❌ Not an admin user");
      return res.status(403).json({ message: "Access denied" });
    }

    (req as any).user = decoded;
    next();
  } catch (err: any) {
  console.error("❌ verifyAdmin error:", err.message);

  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  return res.status(500).json({ message: "Server error" });
  }
}
