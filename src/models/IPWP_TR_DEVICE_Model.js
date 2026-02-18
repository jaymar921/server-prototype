import { randomUUID } from "crypto";
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const IPWP_TR_DEVICE_Schema = new Schema({
  uid: {
    type: Schema.Types.UUID,
    default: randomUUID(),
  },
  registered_by: {
    type: Schema.Types.UUID,
    ref: "ACCOUNT",
    required: true,
  },
  tracker_uname: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  remarks: {
    type: String,
  },
  mobile_number: {
    type: String,
    required: true,
  },
  network: {
    type: String,
    enum: ["GLOBE", "SMART", "DITO"],
    required: true,
  },
  max_capacity: {
    type: Number,
    default: 0,
  },
  capacity: {
    type: Number,
    default: 0,
  },
  metadata: {
    type: String,
    default: "{}",
  },
  date_created: {
    type: Date,
    default: Date.now(),
  },
});

export default mongoose.model("IPWP_TR_DEVICE", IPWP_TR_DEVICE_Schema);
