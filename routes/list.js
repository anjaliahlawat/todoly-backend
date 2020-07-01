const express = require('express')
const router = express.Router()
const asyncMiddleware = require('../middleware/async')

router.get('/', asyncMiddleware(async (req, res) => {
  res.send('Hello World!')
}))