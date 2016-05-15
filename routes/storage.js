var express = require('express')
var router = express.Router()
var storage = require('lib/storage')

router.get('/', function(req, res) {

  return res.status(200).json(storage.get())

  storage((err, result) => {
    if (err) {
      return res.status(500).json(result)
    }
  
    return res.status(200).json(result) 
  })
})

module.exports = router

