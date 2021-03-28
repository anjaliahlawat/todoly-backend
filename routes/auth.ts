const express = require("express");
const jwt = require("jsonwebtoken");
const config = require("config");

const asyncMiddleware = require("../middleware/async");
const UserClass = require("../classes/UserClass");

const router = express.Router();
const userObj = new UserClass();

router.post(
  "/",
  asyncMiddleware(async (req, res) => {
    try {
      const user = await userObj.loginUser(req.body);
      if (!user) return res.status(400).send("Invalid email or password");

      // eslint-disable-next-line no-underscore-dangle
      const token = jwt.sign({ _id: user._id }, config.get("jwtPrivateKey"));
      res.send(token);
    } catch (error) {
      res.status(400).send(error);
    }
    return true;
  })
);

module.exports = router;
