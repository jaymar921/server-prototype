import { Router } from "express";
import {
  addRoute,
  deleteRoute,
  getAllMapRoutes,
  getMapRoute,
  updateRoute,
} from "../controllers/mapRouteController.js";

const router = Router();

router.get("/", getAllMapRoutes);
router.get("/get_route", getMapRoute);
router.post("/add", addRoute);
router.post("/update", updateRoute);
router.delete("/", deleteRoute);

export default router;
