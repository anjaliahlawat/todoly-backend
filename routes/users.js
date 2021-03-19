const express = require('express')
const router = express.Router()
const asyncMiddleware = require('../middleware/async')
const _ = require('lodash')

const UserClass = require('../classes/UserClass')
let userObj = new UserClass()

router.post('/', asyncMiddleware(async (req, res) => {
  const { error } = validate(req.body)
  if(error) return res.status(400).send(error.details[0].message)

  let {name, email, password} = req.body
  
  let user = await userObj.createUser(name, email, password)

  if(!user) 
      return res.status(400).send('User already registered')
  
  res.send({
    result : 'success',
    user : _.pick(user, ['_id', 'name', 'email'])
  })    
}))

module.exports = router;