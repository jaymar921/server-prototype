import { Router } from "express";
import { login } from "../controllers/authenticationController.js";
import rateLimit from "express-rate-limit";

const router = Router();

const loginLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: {
    message: "Too many login attepts, please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/login", loginLimit, login);

export default router;
