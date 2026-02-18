import { Router } from "express";
import {
  deleteAccount,
  getAccount,
  getAccountWithRole,
  getAllAccounts,
  register,
  updateAccount,
} from "../controllers/accountController.js";
import {
  authenticateAdmin,
  authenticateUser,
} from "../middlewares/authMiddleware.js";
const router = Router();

router.get("/", authenticateAdmin, getAllAccounts);
router.get("/get_account", authenticateUser, getAccount);
router.get("/get_account_with_role", authenticateAdmin, getAccountWithRole);
router.post("/register", register);
router.post("/update", authenticateUser, updateAccount);
router.delete("/", authenticateUser, deleteAccount);

export default router;
