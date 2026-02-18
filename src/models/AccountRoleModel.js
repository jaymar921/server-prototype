import { randomUUID } from "crypto";
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const AccountRoleSchema = new Schema({
  uid: {
    type: Schema.Types.UUID,
    default: randomUUID(),
  },
  account: {
    type: Schema.Types.UUID,
    ref: "ACCOUNT",
    required: true,
  },
  role: {
    type: String,
    enum: ["ADMIN", "OPERATOR"],
    required: true,
  },
});

export default mongoose.model("ACCOUNT_ROLE", AccountRoleSchema);
