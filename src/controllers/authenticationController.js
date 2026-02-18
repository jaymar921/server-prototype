import { StatusCodes } from "http-status-codes";
import Account from "../models/AccountModel.js";
import AccountRole from "../models/AccountRoleModel.js";
import { createJWToken } from "../utils/JWTokenUtility.js";
import { comparePassword } from "../utils/PasswordUtility.js";

export const login = async (req, res) => {
  const account = await Account.findOne({ username: req.body.username });

  const isValidAAccount =
    account && (await comparePassword(req.body.password, account.password));

  if (!isValidAAccount)
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Invalid Credentials" });

  // get role
  const accountRole = await AccountRole.findOne({ account: account.uid });

  const token = createJWToken({
    uid: account.uid,
    username: account.username,
    role: accountRole?.role ?? "",
  });

  const oneDay = 1000 * 60 * 60 * 24;

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    sameSite: false,
    secure: true,
  });

  res.status(StatusCodes.OK).json({ message: "User logged in!", token });
};
