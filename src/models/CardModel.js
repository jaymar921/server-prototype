import { randomUUID } from "crypto";
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const CardSchema = new Schema({
  uid: {
    type: Schema.Types.UUID,
    default: randomUUID(),
  },
  account: {
    type: Schema.Types.UUID,
    ref: "ACCOUNT",
    required: true,
  },
  rfid_code: {
    type: String,
    required: true,
  },
  remarks: {
    type: String,
  },
});

export default mongoose.model("CARD", CardSchema);
