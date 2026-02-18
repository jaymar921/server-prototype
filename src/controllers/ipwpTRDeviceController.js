import { StatusCodes } from "http-status-codes";
import IPWPTRDEVICE from "../models/IPWP_TR_DEVICE_Model.js";
import IPWPTRLOCATEDEVICE from "../models/IPWP_TR_LOCATE_Model.js";
import { getAccountByAny } from "./accountController.js";

// utility method
export const getOneDevice = async (uid) => {
  return await IPWPTRDEVICE.findOne({ uid });
};

// utility method for multiple devices [for device names]
export const getManyDevices = async (uids) => {
  const devices = await IPWPTRDEVICE.find({ uid: { $in: uids } });
  return new Map(devices.map((d) => [d.uid, d.device_name]));
};

// create
export const registerIPWP_TR_Device = async (req, res) => {
  let device = req.body;

  if (!device)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Device information is required. " });

  try {
    const account = await getAccountByAny(req.user.username);

    if (account === null)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Account not found." });

    device.registered_by = account.uid;

    const d = await IPWPTRDEVICE.create(device);

    // create the tracking location
    const information = {
      device_uid: d.uid,
      lat: 0,
      long: 0,
      activity: "OFFLINE",
      last_ping: Date.now(),
    };

    // register the tracker
    const tracker = await IPWPTRLOCATEDEVICE.create(information);

    return res.status(StatusCodes.CREATED).json({
      device: d,
      device_location: tracker,
      message: "Device was created successfully.",
    });
  } catch (e) {
    console.log(e);
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Invalid file format. " });
  }
};

// get
export const getOneIPWP_TR_Device = async (req, res) => {
  if (!req.body)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Request body is required. " });

  const { uid } = req.body;

  if (!uid) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "UID is required." });
  }

  const device = await IPWPTRDEVICE.findOne({ uid });

  if (!device)
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "Device not found." });

  return res
    .status(StatusCodes.OK)
    .json({ device, message: "Retrieved Device Information." });
};

// get all
export const getAllIPWP_TR_Device = async (req, res) => {
  const devices = await IPWPTRDEVICE.find({});

  return res.status(StatusCodes.OK).json({
    devices,
    messsage: "Retrieved devices.",
  });
};

// update
export const updateIPWP_TR_Device = async (req, res) => {
  if (!req.body)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Request body is required. " });

  const device = req.body;

  if (!device)
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Device information is required.",
    });

  try {
    const registered_device = await IPWPTRDEVICE.findOneAndUpdate(
      { uid: device.uid },
      device,
    );

    if (!registered_device)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Device not found." });

    return res.status(StatusCodes.OK).json({
      device: registered_device,
      message: "Device was updated successfully.",
    });
  } catch (e) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "There was an issue updating the device.",
    });
  }
};

// delete
export const deleteIWP_TR_Device = async (req, res) => {
  if (!req.body)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Request body is required. " });

  const { uid } = req.body;

  if (!uid) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "UID is required." });
  }

  const device = await IPWPTRDEVICE.findOneAndDelete({ uid });

  // try delete tracker
  try {
    await IPWPTRLOCATEDEVICE.deleteOne({ device_uid: device.uid });
  } catch (ignore) {}

  if (!device)
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "Device not found." });

  return res.status(StatusCodes.OK).json({
    device,
    message: "Device was deleted successfully.",
  });
};
