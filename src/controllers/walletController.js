import { StatusCodes } from "http-status-codes";
import Wallet from "../models/WalletModel.js";
import { getAccountByAny } from "./accountController.js";

// utility
const hasWallet = async (uid) => {
  return (await Wallet.findOne({ account: uid })) !== null;
};

// get all
export const getAllWallets = async (req, res) => {
  const wallets = await Wallet.find({});

  return res
    .status(StatusCodes.OK)
    .json({ wallets, message: "Retrieved wallets successfully." });
};

// get
export const getWallet = async (req, res) => {
  let uid = req.user.uid; // retrieved from the middleware (if logged it, it should be hahaha) - jayharron Feb 11, 2026

  let account;
  // check if there's a req body
  if (req.body) {
    // check if uid is in body and override the previous data
    if (req.body.uid) {
      uid = req.body.uid;
    } else if (req.body.username) {
      // if username is passed, lets get the uid of that account
      account = await getAccountByAny(req.body.username);
      uid = account.uid;
    }
  }

  account = await getAccountByAny(uid);

  const wallet = await Wallet.findOne({ account: uid });

  if (!wallet)
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "Wallet not found based on account specified." });

  return res.status(StatusCodes.OK).json({
    wallet: {
      balance: wallet.balance,
    },
    message: "Retrieved wallet from account specified...",
  });
};

// create
export const createWallet = async (req, res) => {
  let uid = req.user.uid;

  let account;
  // check if there's a req body
  if (req.body) {
    // check if uid is in body and override the previous data
    if (req.body.uid) {
      uid = req.body.uid;
    } else if (req.body.username) {
      // if username is passed, lets get the uid of that account
      account = await getAccountByAny(req.body.username);
      uid = account.uid;
    }
  }

  account = await getAccountByAny(uid);

  // verify if account exists
  if (!account)
    return res.status(StatusCodes.NOT_FOUND).json({
      message: "Account not found based on uid/username specified.",
    });

  if (await hasWallet(uid))
    return res
      .status(StatusCodes.CONFLICT)
      .json({ message: `The user ${account.username} already has a wallet.` });

  const wallet = await Wallet.create({
    account: uid,
    balance: 0,
  });

  return res.status(StatusCodes.CREATED).json({
    wallet,
    message: `Wallet was created successfully for [${account.username}]`,
  });
};

// update
export const updateWallet = async (req, res) => {
  let uid = req.user.uid;

  if (!req.body) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Request body is required." });
  }

  let account;

  if (req.body.uid) {
    uid = req.body.uid;
  } else if (req.body.username) {
    account = await getAccountByAny(req.body.username);
    uid = account.uid;
  }

  account = await getAccountByAny(uid);

  // verify if account exists
  if (!account)
    return res.status(StatusCodes.NOT_FOUND).json({
      message: "Account not found based on uid/username specified.",
    });

  // verify if user doesn't have a wallet, don't proceed
  if (!(await hasWallet(uid)))
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: `The user ${account.username} doesn't have a wallet.` });

  const { balance } = req.body;

  if (!balance) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Balance is required." });
  }

  try {
    await Wallet.updateOne({ account: uid }, { balance });

    return res.status(StatusCodes.OK).json({
      message: `Wallet for ${account.username} was updated to ${balance}`,
    });
  } catch (e) {
    console.log(
      `Error updating wallet balance for ${account.username}: --> ${e}`,
    );
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "There was an issue updating wallet." });
  }
};

// delete
export const deleteWallet = async (req, res) => {
  if (!req.body) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Request body is required." });
  }

  const { uid } = req.body;

  if (!uid) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "UID is required." });
  }

  if (!(await hasWallet(uid))) {
    return res.status(StatusCodes.NOT_FOUND).json({
      message: "UID provided doesn't have a wallet",
    });
  }

  try {
    await Wallet.deleteOne({ account: uid });
    return res.status(StatusCodes.OK).json({
      message: "Wallet was deleted successfully",
    });
  } catch (e) {
    console.log(`Error delete wallet: --> ${e}`);
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "There was an issue deleting the wallet." });
  }
};
