const express = require('express')
const router = express.Router()
const asyncMiddleware = require('../middleware/async')

const { CapturedTask, validate} = require('../modals/captured')

router.get('/:category', asyncMiddleware(async  (req, res) => {
  res.send("hi")
}))

router.post('/:category', asyncMiddleware(async (req, res) => {

       
}))

module.exports = router;