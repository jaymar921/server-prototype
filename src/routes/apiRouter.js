import { Router } from "express";
import {
  getIPWP_LocateDevice,
  getIPWP_LocateDevices,
  updateIPWP_LocateDevice,
} from "../controllers/ipwpTRLocateDeviceController.js";
import { getAllMapRoutes } from "../controllers/mapRouteController.js";

const router = Router();

router.post("/device/update", updateIPWP_LocateDevice);
router.get("/tracker", getIPWP_LocateDevices);
router.get("/tracker/get_location", getIPWP_LocateDevice);
router.get("/route", getAllMapRoutes);

export default router;
