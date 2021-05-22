import { connect as connectMongoDB, set } from "mongoose";
import { get as getConfigVar } from "config";

const startDB = (): void => {
  const db = getConfigVar("test_db");
  connectMongoDB(db).then(() => console.log(`Connecting to ${db} ....`));
  set("useFindAndModify", false);
};

export default startDB;
