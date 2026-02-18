import mongoose from "mongoose";
import { randomUUID } from "crypto";
const Schema = mongoose.Schema;

const AccountSchema = new Schema({
  uid: {
    type: Schema.Types.UUID,
    default: randomUUID(),
  },
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  date_created: {
    type: Date,
    default: Date.now(),
  },
});

// remove the password in data object when sending the user data
AccountSchema.methods.toJSON = function () {
  let obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.model("ACCOUNT", AccountSchema);
