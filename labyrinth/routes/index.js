var express = require('express');
var router = express.Router();
var generator = require('./generator/randomizer-util')
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Labrinyth'});
});

router.get('/generate-seed', function(req, res, next) {

  let generatedSeed = generator.createNewRandomizedRom()

  res.render('generated', { title: 'Labrinyth' , seed: generatedSeed});
});

router.get('/existing-seeds', (req, res, next) => {
    fs.readdir('./public/generated-seeds', function(err, items) {
      res.render('existing', {items: items})
  });
})

module.exports = router;
