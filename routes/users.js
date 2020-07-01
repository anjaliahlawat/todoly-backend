const express = require('express')
const router = express.Router()
const asyncMiddleware = require('../middleware/async')
const { User, validate} = require('../modals/users')

router.get('/', asyncMiddleware(async  (req, res) => {
  res.send("hi")
}))

router.post('/', asyncMiddleware(async (req, res) => {
    let user = new User(
      { 
        email: req.body.email,
        password : req.body.password
      });
    user = await user.save();
    res.send(user)
    
}))

module.exports = router;