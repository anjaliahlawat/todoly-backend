const express = require('express')
const router = express.Router()
const asyncMiddleware = require('../middleware/async')
const Joi = require('joi')
const _ = require('lodash')

const UserClass = require('../classes/UserClass')
let userObj = new UserClass()

router.post('/', asyncMiddleware(async (req, res) => {
  const { error } = validate(req.body)
  if(error) return res.status(400).send(error.details[0].message)

  const {email, password} = req.body
 
  let user = await userObj.loginUser(email, password)
  if(!user) return res.status(400).send('Invalid email or password')

  res.send({
    result : 'success',
    user : _.pick(user, ['_id', 'name', 'email'])
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