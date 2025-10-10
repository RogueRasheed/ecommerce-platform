import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
  admin?: { id: string; username: string };
}

export default function verifyAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string; username: string };
    req.admin = decoded;
    next(); // ✅ proceed to the protected route
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token." });
  }
}
// Middleware to verify admin JWT token