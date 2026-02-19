import { randomUUID } from "crypto";
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const IPWP_TR_LOCATE_Schema = new Schema({
  uid: {
    type: Schema.Types.UUID,
    default: randomUUID(),
  },
  device_uid: {
    type: Schema.Types.UUID,
    ref: "IPWP_TR_DEVICE",
    required: true,
  },
  lat: {
    type: Number,
    required: true,
  },
  long: {
    type: Number,
    required: true,
  },
  speed: {
    type: Number,
    default: 0,
  },
  metadata: {
    type: String,
    default: "{}",
  },
  activity: {
    type: String,
    enum: ["ONLINE", "OFFLINE"],
    required: true,
  },
  last_ping: {
    type: Date,
  },
  prev_lat: {
    type: Number,
    required: false,
  },
  prev_long: {
    type: Number,
    required: false,
  },
});

export default mongoose.model("IPWP_TR_LOCATE", IPWP_TR_LOCATE_Schema);
