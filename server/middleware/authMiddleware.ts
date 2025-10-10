// import jwt from "jsonwebtoken";
// import { Request, Response, NextFunction } from "express";

// interface AuthRequest extends Request {
//   admin?: string;
// }

// export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.status(403).json({ message: "Access denied. No token provided." });
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
//     req.admin = (decoded as any).username;
//     next(); // ✅ allow request to continue to controller/route
//   } catch (err) {
//     return res.status(401).json({ message: "Invalid or expired token." });
//   }
// };
// Middleware to verify JWT token

import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("🚫 No or invalid token header");
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  console.log("🟢 Token received:", token);

  jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
    if (err) {
      console.error("❌ JWT verification failed:", err.message);
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    console.log("✅ Token verified:", decoded);
    (req as any).user = decoded;
    next();
  });
};
// Middleware to verify JWT token