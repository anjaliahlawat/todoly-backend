export default function (handler): (req, res, next) => Promise<void> {
  return async (req, res, next) => {
    try {
      res.header("Access-Control-Allow-Origin", "*");
      await handler(req, res);
    } catch (ex) {
      next(ex);
    }
  };
}
