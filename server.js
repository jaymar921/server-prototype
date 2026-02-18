import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import config from "./src/utils/Config.js";
import cookieParser from "cookie-parser";
import compression from "compression";
import dns from "dns";

// Import Routers
import v1AccountRouter from "./src/routes/accountRouter.js";
import v1AuthenticationRouter from "./src/routes/authenticationRouter.js";
import v1CardRouter from "./src/routes/cardRouter.js";
import v1IPWP_TR_Device_Router from "./src/routes/ipwpDeviceRouter.js";
import v1IPWP_TR_LocateDevice_Router from "./src/routes/ipwpDeviceLocateRouter.js";
import v1MapRouteRouter from "./src/routes/mapRouteRouter.js";
import v1WalletRouter from "./src/routes/walletRouter.js";

// Import Database
import database from "./src/database/MongoDB.js";

// import middlewares
import {
  authenticateAdmin,
  authenticateOperator,
  authenticateUser,
} from "./src/middlewares/authMiddleware.js";

dotenv.config();

const app = express();
const port = config.PORT;

app.use(
  cors({
    origin: config.CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// setup app [middlewares]
app.use(cookieParser()); // allow node to read cookies
app.use(express.json()); // use JSON as payload
app.use(compression()); // compress all routes

// Routers
app.use("/api/v1/account", v1AccountRouter);
app.use("/api/v1/auth", v1AuthenticationRouter);
app.use("/api/v1/card", authenticateAdmin, v1CardRouter);
app.use("/api/v1/device", authenticateOperator, v1IPWP_TR_Device_Router);
app.use("/api/v1/tracker", v1IPWP_TR_LocateDevice_Router);
app.use("/api/v1/route", authenticateAdmin, v1MapRouteRouter);
app.use("/api/v1/wallet", authenticateUser, v1WalletRouter);

// set dns for mongodb
dns.setServers(["1.1.1.1", "8.8.8.8"]);
// run database
database();

const server = app.listen(port, () => {
  console.log(`Server is now running: http://localhost:${port}`);
});

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;

export default app;
