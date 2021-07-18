import { connect as connectMongoDB, set } from "mongoose";
import { get as getConfigVar } from "config";

const { NODE_ENV } = process.env;

const startDB = (): void => {
  const db = NODE_ENV === "test" ? getConfigVar("test_db") : getConfigVar("db");
  // eslint-disable-next-line no-console
  connectMongoDB(db).then(() => console.log(`Connecting to ${db} ....`));
  set("useFindAndModify", false);
};

export default startDB;
