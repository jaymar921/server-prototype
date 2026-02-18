import { Router } from "express";
import {
  deleteCard,
  getAllCards,
  registerCard,
  updateCard,
} from "../controllers/cardController.js";
import {
  authenticateAdmin,
  authenticateOperator,
} from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", authenticateAdmin, getAllCards);
router.post("/register", authenticateAdmin, registerCard);
// operators and admins are allowed to update the card
router.post("/update", authenticateOperator, updateCard);
router.delete("/", authenticateAdmin, deleteCard);

export default router;
