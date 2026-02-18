import { StatusCodes } from "http-status-codes";
import { randomUUID } from "crypto";
import Account from "../models/AccountModel.js";
import AccountRole from "../models/AccountRoleModel.js";
import { hashPassword } from "../utils/PasswordUtility.js";
import Wallet from "../models/WalletModel.js";

export const getAccount = async (req, res) => {
  let uid = req.body?.uid; // <-- use body

  if (!uid) {
    // parse logged in account
    uid = req.user.uid;
  }

  if (!uid) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "UID is required" });
  }

  const account = await Account.findOne({ uid });

  if (!account) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "Account Not Found!" });
  }

  const accountWithoutPassword = account.toJSON();
  res.status(StatusCodes.OK).json({ account: accountWithoutPassword });
};

export const getAccountWithRole = async (req, res) => {
  let uid = req.body?.uid; // <-- use body

  if (!uid) {
    // parse logged in account
    uid = req.user.uid;
  }

  if (!uid) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "UID is required" });
  }

  const account = await Account.findOne({ uid });

  if (!account) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "Account Not Found!" });
  }

  // Convert to plain object so we can safely add fields
  const accountWithoutPassword = account.toJSON();

  const roles = await AccountRole.findOne({ account: account.uid });

  // Attach role to the response object
  accountWithoutPassword.role = roles?.role ?? "";

  res.status(StatusCodes.OK).json({ account: accountWithoutPassword });
};

export const getAccountByAny = async (str) => {
  try {
    let account = await Account.findOne({ username: str });

    if (account === null) account = await Account.findOne({ email: str });
    if (account === null) account = await Account.findOne({ uid: str });
    if (account === null) return null;
    return account.toJSON();
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const getAllAccounts = async (req, res) => {
  const accounts = await Account.find({})
    .sort({ lastname: "desc" })
    .sort({ firstname: "desc" })
    .exec();

  return res
    .status(StatusCodes.OK)
    .json({ accounts, message: "Retrieved Accounts Successfully." });
};

export const register = async (req, res) => {
  const account = req.body;

  try {
    // TODO: simplify this soon
    // check for existing username and return conflict
    if (
      await Account.findOne({
        username: req.body.username,
      })
    ) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ message: "Username already exists!" });
    }

    // check for existing email and return conflict
    if (
      await Account.findOne({
        email: req.body.email,
      })
    ) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ message: "Email already exists!" });
    }

    account.password = await hashPassword(account.password);
    account.uid = randomUUID();

    const user = await Account.create(account);

    // create a wallet associated with the account
    await Wallet.create({
      account: user.uid,
      balance: 0,
    });

    res
      .status(StatusCodes.CREATED)
      .json({ message: "User Created Successfully.", user });
  } catch (e) {
    console.log("error: " + e);
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Failed to create account." });
  }
};

export const updateAccount = async (req, res) => {
  const updated_account = req.body;

  // chekc if updated_account is not null
  if (!updated_account) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Account is required" });
  }

  const user_uid = updated_account.uid;

  if (!user_uid) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "UID is required" });
  }
  // delete username/uid it must not be updated
  delete updated_account.username;
  delete updated_account.uid;

  // hash password if there is
  if (updated_account.password)
    updated_account.password = await hashPassword(updated_account.password);

  const updated_data = await Account.findOneAndUpdate(
    {
      uid: user_uid,
    },
    updated_account,
  );

  if (!updated_data) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "Account Not Found!" });
  }

  return res.status(StatusCodes.OK).json({
    account: updated_account,
    message: "Account was updated successfully",
  });
};

export const deleteAccount = async (req, res) => {
  const { uid } = req.body;

  if (!uid) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "UID is required" });
  }

  const account = await Account.findOneAndDelete({ uid });

  if (!account) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "Account Not Found!" });
  }
  return res
    .status(StatusCodes.OK)
    .json({ account, message: "Account was deleted successfully." });
};
