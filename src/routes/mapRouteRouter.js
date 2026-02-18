import { Router } from "express";
import {
  addRoute,
  deleteRoute,
  getAllMapRoutes,
  getMapRoute,
  updateRoute,
} from "../controllers/mapRouteController.js";
import { authenticateAdmin } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", getAllMapRoutes);
router.get("/get_route", authenticateAdmin, getMapRoute);
router.post("/add", authenticateAdmin, addRoute);
router.post("/update", authenticateAdmin, updateRoute);
router.delete("/", authenticateAdmin, deleteRoute);

export default router;
