const config = require("config");
const express = require("express");
const _ = require("lodash");
const jwt = require("jsonwebtoken");

const asyncMiddleware = require("../middleware/async");
const UserClass = require("../classes/UserClass");

const router = express.Router();
const userObj = new UserClass();

router.post(
  "/",
  asyncMiddleware(async (req, res) => {
    try {
      const user = await userObj.createUser(req.body);
      if (!user) return res.status(400).send("User already registered");

      const token = jwt.sign({ _id: user._id }, config.get("jwtPrivateKey"));

      res.header("x-auth-token", token).send({
        user: _.pick(user, ["_id", "username", "phoneNumber", "email"]),
      });
    } catch (error) {
      res.status(400).send(error);
    }
  })
);

module.exports = router;
