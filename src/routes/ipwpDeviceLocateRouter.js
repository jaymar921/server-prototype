import { Router } from "express";
import {
  createIPWP_TR_LOCATE_Device,
  deleteIPWP_LocateDevice,
  getIPWP_LocateDevice,
  getIPWP_LocateDevices,
  updateIPWP_LocateDevice,
} from "../controllers/ipwpTRLocateDeviceController.js";
import { authenticateOperator } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", getIPWP_LocateDevices);
router.get("/get_location", authenticateOperator, getIPWP_LocateDevice);
router.post("/register", authenticateOperator, createIPWP_TR_LOCATE_Device);
router.post("/update", authenticateOperator, updateIPWP_LocateDevice);
router.delete("/", authenticateOperator, deleteIPWP_LocateDevice);

export default router;
