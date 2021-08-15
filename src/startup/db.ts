import { connect as connectMongoDB, set } from "mongoose";
import { get as getConfigVar } from "config";

const { NODE_ENV } = process.env;

const startDB = (): void => {
  let db: string;
  if (NODE_ENV === "dev" || NODE_ENV === "production") {
    getConfigVar("db");
  } else {
    getConfigVar("test_db");
  }
  connectMongoDB(db, { useNewUrlParser: true }).then(() =>
    // eslint-disable-next-line no-console
    console.log(`Connecting to db ....`)
  );
  set("useFindAndModify", false);
};

export default startDB;
