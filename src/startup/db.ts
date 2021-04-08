import { connect as connectMongoDB } from "mongoose";
import { get as getConfigVar } from "config";

module.exports = () => {
  const db = getConfigVar("db");
  connectMongoDB(db).then(() => console.log(`Connecting to ${db} ....`));
};
