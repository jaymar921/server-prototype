import mongoose from "mongoose";
import config from "../utils/Config.js";

const database = () => {
  console.log("Connecting to mongodb");
  mongoose.connect(config.DATABASE_URL, {
    serverApi: { version: "1", strict: false, deprecationErrors: true },
  });

  const database = mongoose.connection;

  database.on("error", (error) => {
    console.error("There was an issue on the database connection: " + error);
  });
  database.once("open", () => {
    console.log("MongoDB - Connected to Database");
  });

  return database;
};

export default database;
