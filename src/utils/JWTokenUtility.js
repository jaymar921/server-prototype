import jwt from "jsonwebtoken";
import config from "./Config.js";

export const createJWToken = (payload) => {
  const token = jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: "24hr",
  });
  return token;
};

export const verifyJWT = (token) => {
  const decoded = jwt.verify(token, config.JWT_SECRET);
  return decoded;
};
