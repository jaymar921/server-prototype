import { StatusCodes } from "http-status-codes";
import { verifyJWT } from "../utils/JWTokenUtility.js";
import config from "../utils/Config.js";

export const authenticateUser = async (req, res, next) => {
  let { token } = req.cookies; // grab the token from the cookies

  try {
    if (!token) token = (req.headers["authorization"] ?? "").split(" ")[1]; // automatically throws error if parsing fails

    const { uid, username, role, exp } = verifyJWT(token);

    // Check if token is expired
    if (Date.now() >= exp * 1000) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Token expired, please login again!" });
    }

    req.user = { uid, username, role };
    next();
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Authentication Error" });
  }
};

export const authenticateAdmin = async (req, res, next) => {
  let { token } = req.cookies; // grab the token from the cookies

  try {
    if (!token) token = (req.headers["authorization"] ?? "").split(" ")[1]; // automatically throws error if parsing fails

    const { uid, username, role, exp } = verifyJWT(token);

    // Check if token is expired
    if (Date.now() >= exp * 1000) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Token expired, please login again!" });
    }

    if (role !== "ADMIN")
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Unauthorized Access" });

    req.user = { uid, username, role };
    next();
  } catch (error) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Authentication Error" });
  }
};

export const authenticateOperator = async (req, res, next) => {
  let { token } = req.cookies; // grab the token from the cookies

  try {
    if (!token) token = (req.headers["authorization"] ?? "").split(" ")[1]; // automatically throws error if parsing fails

    const { uid, username, role, exp } = verifyJWT(token);

    // Check if token is expired
    if (Date.now() >= exp * 1000) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Token expired, please login again!" });
    }

    if (role !== "ADMIN" && role !== "OPERATOR")
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Unauthorized Access" });

    req.user = { uid, username, role };
    next();
  } catch (error) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Authentication Error" });
  }
};

export const authenticateAPIKeys = async (req, res, next) => {
  try {
    const api_key = (req.headers["authorization"] ?? "").split(" ")[1]; // automatically throws error if parsing fails

    // TODO: Make api keys available to be modified via admin dashboard
    if (api_key.toUpperCase() !== config.DEFAULT_API_KEY.toUpperCase())
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Invalid API keys" });

    next();
  } catch (error) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Authentication Error" });
  }
};
