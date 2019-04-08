var express = require('express');
var router = express.Router();
var generator = require('./generator/randomizer-util')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Labrinyth'});
});

router.get('/generate-seed', function(req, res, next) {

  let generatedSeed = generator.createNewRandomizedRom()

  res.render('generated', { title: 'Labrinyth' , seed: generatedSeed});
});

module.exports = router;
