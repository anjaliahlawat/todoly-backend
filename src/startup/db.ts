import { connect as connectMongoDB, set } from "mongoose";
import { get as getConfigVar } from "config";

const { NODE_ENV } = process.env;

const startDB = (): void => {
  const db = NODE_ENV === "test" ? getConfigVar("test_db") : getConfigVar("db");
  connectMongoDB(db, { useNewUrlParser: true }).then(() =>
    // eslint-disable-next-line no-console
    console.log(`Connecting to db ....`)
  );
  set("useFindAndModify", false);
};

export default startDB;
