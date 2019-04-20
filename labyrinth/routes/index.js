var express = require('express');
var router = express.Router();
var generator = require('./generator/randomizer-util')
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  let hasRom = req.session.uploadedrom !== undefined
  res.render('index', { title: 'Labrinyth', hasRom: hasRom});
});

router.get('/generate-seed', function(req, res, next) {

  let romname = './uploaded-roms/' + req.session.uploadedrom
  let skipSpoilers = req.query.skipSpoilers;
  let generatedSeed = generator.createNewRandomizedRom((skipSpoilers ? true : false), romname)

  res.render('generated', { title: 'Labrinyth' , seed: generatedSeed});
});

// router.get('/existing-seeds', (req, res, next) => {
//     fs.readdir('./public/generated-seeds', function(err, items) {
//       res.render('existing', {items: items})
//   });
// })

router.post('/upload-rom-for-patch', (req, res, next) => {
  console.log(req.files)
    let rom = req.files.rom
    let seed = new Date().getTime();
    rom.mv('./uploaded-roms/' + seed + '-' + rom.name)
    console.log(rom.name)

    //TODO Session Mgmt to 
    //1 check if they've uploaded a file
    console.log(req.session)
    req.session.uploadedrom = seed + '-' + rom.name
    //req.session.fileUploaded = rom
    //2 use it to pass in 

    res.redirect("/")

})

module.exports = router;
