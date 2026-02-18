import { Router } from "express";
import {
  createWallet,
  deleteWallet,
  getAllWallets,
  getWallet,
  updateWallet,
} from "../controllers/walletController.js";
import { authenticateAdmin } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", authenticateAdmin, getAllWallets);
router.get("/get_wallet", getWallet);
router.post("/create", createWallet);
router.post("/update", authenticateAdmin, updateWallet);
router.delete("/", authenticateAdmin, deleteWallet);

export default router;
