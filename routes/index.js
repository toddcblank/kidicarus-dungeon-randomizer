var express = require('express');
var router = express.Router();
var generator = require('./generator/randomizer-util')
var seedrandom = require('seedrandom');
var fs = require('fs')

const DIFF_ABBREV = ["U", "E", "N", "H"]
/* GET home page. */
router.get('/', function(req, res, next) {
  let hasRom = req.session.uploadedrom !== undefined
  res.render('index', { title: 'Kid Icarus Randomizer', hasRom: hasRom, spoilersOnly: false});
});

router.get('/generate-maps-only', function(req, res, next) {
  res.render('index', { title: 'Kid Icarus Randomizer', spoilersOnly: true});
})

router.get('/endless-level', function(req, res, next) {
   
  let difficulty = 1
  // var rngSeed = getRngSeed(req, false);
  var rngSeed = 'E4CAE6D'

  let rom = req.session.uploadedrom
  // let romFullPath = './uploaded-roms/' + rom
  let romFullPath = './uploaded-roms/kidicarus.nes'

  // if (rom == undefined) {
  //   console.log("No rom uploaded, redirecting")
  //   res.redirect("/")
  //   return;
  // }
  
  let rng = seedrandom(rngSeed);
  Math.random = () => {
    return rng();
  }

  var endlessLength = 8;
  if(req.query.endlessLength !== undefined) {
    endlessLength = Number.parseInt(req.query.endlessLength)
  }
  
  let generatedSeed = generator.createEndlessLevel1Rom(romFullPath, rngSeed, difficulty, endlessLength);

  res.render('generated', { title: 'Kid Icarus Randomizer' , seed: 'Arcade-' + endlessLength + "-" + generatedSeed, spoilers: true});
})

router.post('/generate-maps-only', function(req, res, next) {
  let difficulty = req.body.difficulty
  var rngSeed = getRngSeed(req);
  let rng = seedrandom(rngSeed);
  Math.random = () => {
    return rng();
  }

  //this would be pointless.
  let skipSpoilers = false;

  //There's definitely a better way to do this, but I'll save that for another day.
  let fortressesToRandomize = []
  let levelsToRandomize = []
  let useFbsLogic = []
  levelsToRandomize.push(1)
  levelsToRandomize.push(2)
  levelsToRandomize.push(3)
  levelsToRandomize.push(4);    
  fortressesToRandomize.push(1)
  fortressesToRandomize.push(2)
  fortressesToRandomize.push(3)
  
  if (req.body.useFbsLogic == 1) {
    useFbsLogic.push(1)    
    useFbsLogic.push(2)    
    useFbsLogic.push(3)
  }

  let generatedSeed = generator.createNewRandomizedRom(false, '', rngSeed, levelsToRandomize, fortressesToRandomize, difficulty, useFbsLogic, true)

  res.render('generated', { title: 'Kid Icarus Randomizer' , seed: generatedSeed, spoilers: !skipSpoilers, spoilersOnly: true});
})

router.get('/generate-seed', function(req, res, next) {
  res.redirect("/")
});

router.post('/generate-seed', function(req, res, next) {

  let difficulty = req.body.difficulty
  let raceMode = req.body.skipSpoilers;
  var rngSeed = getRngSeed(req, raceMode);

  let rom = req.session.uploadedrom
  let romFullPath = './uploaded-roms/' + rom

  if (rom == undefined) {
    console.log("No rom uploaded, redirecting")
    res.redirect("/")
    return;
  }
  
  //If we're in race mode, make the RNG Seed different than the seed that's displayed


  let rng = seedrandom(rngSeed);
  Math.random = () => {
    return rng();
  }
  
  //There's definitely a better way to do this, but I'll save that for another day.
  let fortressesToRandomize = []
  let levelsToRandomize = []
  let useFbsLogic = []
  levelsToRandomize.push(1)
  levelsToRandomize.push(2)
  levelsToRandomize.push(3)
  levelsToRandomize.push(4);    
  fortressesToRandomize.push(1)
  fortressesToRandomize.push(2)
  fortressesToRandomize.push(3)
  
  if (req.body.useFbsLogic == 1) {
    useFbsLogic.push(1)    
    useFbsLogic.push(2)    
    useFbsLogic.push(3)
  }

  var useNewRooms = true;
  if (req.body.useNewRooms == 2) {
    useNewRooms = false;
  }

  let doors = req.body.doors;

  let generatedSeed = generator.createNewRandomizedRom((raceMode ? true : false), romFullPath, rngSeed, levelsToRandomize, fortressesToRandomize, difficulty, useFbsLogic, false, doors, useNewRooms)

  res.render('generated', { title: 'Kid Icarus Randomizer' , seed: generatedSeed, spoilers: !raceMode});
});



// router.get('/existing-seeds', (req, res, next) => {
//     fs.readdir('./public/generated-seeds', function(err, items) {
//       res.render('existing', {items: items})
//   });
// })

router.post('/upload-rom-for-patch', (req, res, next) => {
  
    let rom = req.files.rom
    let seed = new Date().getTime();
    rom.mv('./uploaded-roms/' + seed + '-' + rom.name)  
    req.session.uploadedrom = seed + '-' + rom.name  
    res.redirect("/")

})

function getRngSeed(req, raceMode) { 

    var difficulty = 1;
    if (req.body.difficulty !== undefined) {
      difficulty = req.body.difficulty
    }
    var rngSeed = new Date().getTime().toString(16).substr(5).toUpperCase();

    if (req.body.seed && req.body.seed != 0 && !raceMode) {
      rngSeed = req.body.seed;
    }
    
    rngSeed = DIFF_ABBREV[difficulty] + rngSeed;

    if (raceMode) {
      //ignore any seed passed in
      rngSeed = "R" + rngSeed;
    }

    console.log("Using seed " + rngSeed)

    return rngSeed;
}

module.exports = router;
