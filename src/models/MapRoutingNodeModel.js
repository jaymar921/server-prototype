import mongoose from "mongoose";
import { randomUUID } from "crypto";

const Schema = mongoose.Schema;

const MapRoutingNodeSchema = new Schema({
  uid: {
    type: Schema.Types.UUID,
    default: randomUUID(),
  },
  prev_node: {
    type: Schema.Types.UUID,
    default: undefined,
  },
  lat: {
    type: Number,
    required: true,
  },
  long: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  map_display_name: {
    type: String,
    default: "",
  },
  last_node: {
    type: Boolean,
    default: false,
  },
  showicon: {
    type: Boolean,
    default: false,
  },
  groupname: {
    type: String,
    default: "",
  },
});

export default mongoose.model("MAP_ROUTING_NODE", MapRoutingNodeSchema);
