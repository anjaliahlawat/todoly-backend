const express = require("express");

const router = express.Router();
const _ = require("lodash");
const asyncMiddleware = require("../middleware/async");

const UserClass = require("../classes/UserClass");

const userObj = new UserClass();

router.post(
  "/",
  asyncMiddleware(async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { name, email, password } = req.body;

    const user = await userObj.createUser(name, email, password);

    if (!user) return res.status(400).send("User already registered");

    res.send({
      result: "success",
      user: _.pick(user, ["_id", "name", "email"]),
    });
  })
);

module.exports = router;
