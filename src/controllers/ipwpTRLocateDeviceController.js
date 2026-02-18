import { StatusCodes } from "http-status-codes";
import IPWPTRLOCATEDEVICE from "../models/IPWP_TR_LOCATE_Model.js";
import { getManyDevices, getOneDevice } from "./ipwpTRDeviceController.js";

// create
export const createIPWP_TR_LOCATE_Device = async (req, res) => {
  const information = req.body;

  if (!information) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Location information is required. " });
  }

  if (!information.device_uid) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Device UID is required, make sure device_uid is in JSON body.",
    });
  }

  // check if device uid is valid
  const device = await getOneDevice(information.device_uid);

  if (!device) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "Device was not found." });
  }

  // only one device has one location tracker, check if there's existing
  const existing_tracker = await IPWPTRLOCATEDEVICE.findOne({
    device_uid: device.uid,
  });

  // if exist, return
  if (existing_tracker) {
    existing_tracker.device_name = device.name;
    return res.status(StatusCodes.CONFLICT).json({
      device_location: existing_tracker,
      message:
        "An existing Tracking location device already exist. Just update the information.",
    });
  }

  information.device_uid = device.uid;
  if (!information.activity) information.activity = "ONLINE";

  information.last_ping = Date.now();

  const device_location = await IPWPTRLOCATEDEVICE.create(information);

  device_location.device_name = device.name;

  return res.status(StatusCodes.CREATED).json({
    device_location,
    message: "Tracking Location for device was added.",
  });
};

// get
export const getIPWP_LocateDevice = async (req, res) => {
  if (!req.query) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Request query is required." });
  }

  const { uid } = req.query;

  if (!uid) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "UID is required." });
  }

  const device = await getOneDevice(uid);

  if (!device) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "Device not found." });
  }

  const device_location = await IPWPTRLOCATEDEVICE.findOne({
    device_uid: device.uid,
  });

  if (!device_location) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "Device Tracking Location not found." });
  }

  return res.status(StatusCodes.OK).json({
    device_location,
    device_information: {
      tracker_uname: device.tracker_uname,
      name: device.name,
    },
    message: "Device Tracking Location was retrieved.",
  });
};

// get all
export const getIPWP_LocateDevices = async (req, res) => {
  const device_location = await IPWPTRLOCATEDEVICE.find({});

  // Collect all UIDs
  const uids = device_location.map((d) => d.device_uid);

  // Fetch all devices in one query
  const deviceMap = await getManyDevices(uids);

  // Attach names
  for (const tracker of device_location) {
    tracker.device_name = deviceMap.get(tracker.device_uid);
  }

  return res.status(StatusCodes.OK).json({
    device_location,
    message: "Retrieved Device Tracking Locations.",
  });
};

// update
export const updateIPWP_LocateDevice = async (req, res) => {
  if (!req.body) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Request body is required." });
  }

  const { uid, lat = 0, long = 0, speed = 0 } = req.body;

  if (!uid) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "UID is required." });
  }

  const device = await getOneDevice(uid);

  if (!device) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "Device not found." });
  }

  const device_location = await IPWPTRLOCATEDEVICE.findOne({
    device_uid: device.uid,
  });

  if (!device_location) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "Device Tracking Location not found." });
  }

  const new_data = {
    uid: device_location.uid,
    lat: lat,
    long: long,
    speed: speed,
    activity: "ONLINE",
    last_ping: Date.now(),
  };

  try {
    await IPWPTRLOCATEDEVICE.findOneAndUpdate(
      { uid: device_location.uid },
      new_data,
    );

    new_data.device = {
      tracker_uname: device.tracker_uname,
      name: device.name,
    };

    return res.status(StatusCodes.OK).json({
      device_location: new_data,
      message: "Device location was updated successfully.",
    });
  } catch (e) {
    console.log(e);
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "There was an issue updating the device location.",
    });
  }
};

// delete
export const deleteIPWP_LocateDevice = async (req, res) => {
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

  const device = await getOneDevice(uid);

  if (!device) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "Device not found." });
  }

  const data = await IPWPTRLOCATEDEVICE.findOneAndDelete({ device_uid: uid });

  if (!data)
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "Device location not found." });

  return res.status(StatusCodes.OK).json({
    device_loation: data,
    message: "Device location was deleted successfully.",
  });
};
