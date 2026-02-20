import { StatusCodes } from "http-status-codes";
import { randomUUID } from "crypto";
import MapRoutingNode from "../models/MapRoutingNodeModel.js";

// get all /
export const getAllMapRoutes = async (req, res) => {
  const last_node = req.body?.last_node ?? false;
  let map_routes = await MapRoutingNode.find({});

  // if last node only
  if (last_node) map_routes = map_routes.filter((a) => a.last_node);

  return res.status(StatusCodes.OK).json({
    map_routes,
    message: "Map Routes retrieved.",
  });
};

// get / get_route
export const getMapRoute = async (req, res) => {
  if (!req.body) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Request body is required.",
    });
  }

  const { uid } = req.body;

  if (!uid) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "UID is required." });
  }

  let i = 0;

  const map_routes = [];
  let id_lookup = uid;

  // unsure of the logic here, basta mao ni, usbon rani puhon for efficiency.
  while (i++ < 1000) {
    if (!id_lookup) break;

    const data = await MapRoutingNode.findOne({ uid: id_lookup });

    map_routes.push(data);

    // if id_lookup is null here, the if condition above triggers
    id_lookup = data.prev_node;
  }

  return res.status(StatusCodes.OK).json({
    map_routes,
    message: "Map Routes retrieved.",
  });
};

// create
export const addRoute = async (req, res) => {
  if (!req.body) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Request body is required.",
    });
  }

  // make sure uid is null (it will be auto-generated)

  const route = req.body;

  try {
    route.uid = randomUUID();
    // get prev node
    if (route.prev_node) {
      const prev_data = await MapRoutingNode.findOne({ uid: route.prev_node });
      route.prev_node = prev_data.uid;
    } else {
      route.prev_node = null;
    }
    const map_route = await MapRoutingNode.create(route);

    return res.status(StatusCodes.CREATED).json({
      map_route,
      message: `Map Route was added successfully. ${!map_route.last_node ? "Be sure to add a last node." : ""}`,
    });
  } catch (e) {
    console.log("Error on MapRouteController: " + e);
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "There was an issue adding route.",
    });
  }
};

// update
export const updateRoute = async (req, res) => {
  if (!req.body) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Request body is required." });
  }

  const updated_route = req.body;

  if (!updated_route.uid) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "UID is required." });
  }

  try {
    const map_route = await MapRoutingNode.updateOne(
      { uid: updated_route.uid },
      updated_route,
    );

    if (!map_route.acknowledged) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Map route not found." });
    }

    return res.status(StatusCodes.OK).json({
      map_route: updated_route,
      message: "Map route was updated.",
    });
  } catch (e) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "There was an issue updating map_route." });
  }
};

// delete
export const deleteRoute = async (req, res) => {
  if (!req.body) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Request body is required." });
  }

  const { uid, groupname } = req.body;

  if (!uid || !groupname) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "UID/Groupname is required.",
    });
  }

  try {
    const deleted_route = uid
      ? await MapRoutingNode.deleteMany({ uid })
      : await MapRoutingNode.deleteMany({ groupname });

    if (!deleted_route.acknowledged) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Map route was not found. Could not execute delete operation.",
      });
    }

    return res.status(StatusCodes.OK).json({
      message: "Map route was deleted successfully.",
    });
  } catch (e) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "There was an issue deleting map route.",
    });
  }
};
