import { Router } from "express";
import {
  registerIPWP_TR_Device,
  getAllIPWP_TR_Device,
  getOneIPWP_TR_Device,
  updateIPWP_TR_Device,
  deleteIWP_TR_Device,
} from "../controllers/ipwpTRDeviceController.js";
import { authenticateAdmin } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", getAllIPWP_TR_Device);
router.get("/get_device", getOneIPWP_TR_Device);
router.post("/register", authenticateAdmin, registerIPWP_TR_Device);
router.post("/update", authenticateAdmin, updateIPWP_TR_Device);
router.delete("/", authenticateAdmin, deleteIWP_TR_Device);

export default router;
