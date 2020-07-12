const express = require('express')
const router = express.Router()
const asyncMiddleware = require('../middleware/async')
const bcrypt = require('bcrypt')
const { User} = require('../modals/users')
const Joi = require('joi')

router.post('/', asyncMiddleware(async (req, res) => {
  const { error } = validate(req.body);
  if(error) return res.status(400).send(error.details[0].message)

  let user = await User.findOne({ email: req.body.email })
  if(!user) return res.status(400).send('Invalid email or password')

  const validPassword = bcrypt.compare(req.body.password, user.password)
  if(!validPassword) return res.status(400).send('Invalid email or password')

  res.send({
    result : 'success',
    user : user
  })    
}))

function validate(req){
  const schema = {
    email : Joi.string().min(5).max(255).required(),
    password : Joi.string().min(5).max(1024).required()
  }

  return Joi.validate(req, schema)
}

module.exports = router;