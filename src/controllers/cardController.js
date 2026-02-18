import { StatusCodes } from "http-status-codes";
import Card from "../models/CardModel.js";
import { getAccountByAny } from "./accountController.js";

export const registerCard = async (req, res) => {
  try {
    const newCard = req.body;

    const account = await getAccountByAny(newCard.account);

    if (account === null)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Account not found." });

    newCard.account = account.uid;

    const card = await Card.create(newCard);

    res
      .status(StatusCodes.CREATED)
      .json({ message: "Card was created.", card });
  } catch (e) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "There was an issue creating card." });
  }
};

// update card
export const updateCard = async (req, res) => {
  const updated_card = req.body;

  // check if updated card is not null
  if (!updated_card)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Card information is required!" });

  const updated_data = await Card.findOneAndUpdate(
    {
      uid: updated_card.uid,
    },
    updated_card,
  );

  if (!updated_data)
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "Card not found!" });

  return res.status(StatusCodes.OK).json({
    card: updated_card,
    message: "Card was updated successfully.",
  });
};

// delete card
export const deleteCard = async (req, res) => {
  if (!req.body)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Body is required" });

  const { uid } = req.body;

  if (!uid) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "UID is required" });
  }

  const card = await Card.findOneAndDelete({ uid });

  if (!card)
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "Card not found!" });

  return res.status(StatusCodes.OK).json({
    card,
    message: "Card was deleted successfully.",
  });
};

// get all cards
export const getAllCards = async (req, res) => {
  const cards = await Card.find({});

  return res
    .status(StatusCodes.OK)
    .json({ message: "Retrieved cards successfully.", cards });
};
