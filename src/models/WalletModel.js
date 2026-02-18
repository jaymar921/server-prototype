import { randomUUID } from "crypto";
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const WalletSchema = new Schema({
  uid: {
    type: Schema.Types.UUID,
    default: randomUUID(),
  },
  account: {
    type: Schema.Types.UUID,
    ref: "ACCOUNT",
    required: true,
  },
  balance: {
    type: Number,
    required: true,
  },
});

export default mongoose.model("WALLET", WalletSchema);
