import { connect as connectMongoDB } from "mongoose";
import { get as getConfigVar } from "config";

const startDB = (): void => {
  const db = getConfigVar("db");
  connectMongoDB(db).then(() => console.log(`Connecting to ${db} ....`));
};

export default startDB;
