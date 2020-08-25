const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const asyncMiddleware = require('../middleware/async')
const { User, validate} = require('../modals/users')

router.get('/', asyncMiddleware(async  (req, res) => {
  res.send("hi")
}))

router.post('/', asyncMiddleware(async (req, res) => {

  const { error } = validate(req.body)
  if(error) return res.status(400).send(error.details[0].message)

  let user = await User.findOne({ email: req.body.email })

  if(user) return res.status(400).send('User already registered')

   user = new User(
      { 
        name: req.body.name,
        email: req.body.email,
        password : req.body.password
      })

      const salt = await bcrypt.genSalt(10)
      user.password = await bcrypt.hash(user.password, salt)
      user = await user.save();
      res.send({
        result : 'success',
        user : _.pick(user, ['_id', 'name', 'email'])
      })    
}))

module.exports = router;