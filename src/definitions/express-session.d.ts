import "express-session";
import { User } from "../users/user.entity"; // Adjust path as needed

declare module "express-session" {
    interface SessionData {
        user?: User;
        userId?: number | null;
    }
}

declare module "express" {
    interface Request {
      currentUser?: User;
    }
  }