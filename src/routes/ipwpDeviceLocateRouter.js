import { Router } from "express";
import {
  createIPWP_TR_LOCATE_Device,
  deleteIPWP_LocateDevice,
  getIPWP_LocateDevice,
  getIPWP_LocateDevices,
  updateIPWP_LocateDevice,
} from "../controllers/ipwpTRLocateDeviceController.js";
import {
  authenticateOperator,
  authenticateUser,
} from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", authenticateUser, getIPWP_LocateDevices);
router.get("/get_location", authenticateOperator, getIPWP_LocateDevice);
router.post("/register", authenticateOperator, createIPWP_TR_LOCATE_Device);
router.post("/update", updateIPWP_LocateDevice); // TODO: Secure this!!! This is not secure but will work on it soon
router.delete("/", authenticateOperator, deleteIPWP_LocateDevice);

export default router;
