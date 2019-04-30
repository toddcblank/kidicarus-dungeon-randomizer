let dg = require('./generate-dungeon')
let rp = require('./rom-patcher')
let romPath = './public/generated-seeds/'
let fs = require('fs')
let fbs = require('./fbs-generator')
let fbsf = require('./fbs-fortress-generator')

let ADD_MAP_PATCH_D14 = {
    data: ["1b", "88", 'FF'],
    offset: 0x1b2c4
}

let ADD_MAP_PATCH_D24 = {
    data: ["1b", "88", 'FF'],
    offset: 0x1b5b8
}

let ADD_MAP_PATCH_D34 = {
    data: ["1b", "88", 'FF'],
    offset: 0x1B88C
}

let ENEMY_POSITION_PATCH_D1 = {
    data: "44 74 A8 7C 44 6D A2 AA 74 56 5A 7B 73 77 7D AA 44 72 19 AD A2 54 49 AC 48 77 73 7A 56 5A A5 AD 4C 64 8C A4 43 01 4C 01 76 00 8D 00 75 02 75 00 75 03 8A 00 43 01 43 03 AB 00 AB 02 35 03 65 03 86 03 8A 02 44 A6 A4 A8 36 87 36 87".split(" "),
    offset: 0x1B278
}

let ENEMY_POSITION_PATCH_D2 = {
    data: "44 74 A8 7C 44 6D A2 AA 74 56 5A 7B 73 77 7D AA 44 72 19 AD A2 54 49 AC 48 77 73 7A 56 5A A5 AD 4C 64 8C A4 43 01 4C 01 76 00 8D 00 75 02 75 00 75 03 8A 00 43 01 43 03 AB 00 AB 02 35 03 65 03 86 03 8A 02 44 A6 A4 A8 36 87 36 87".split(" "),
    offset: 0x1B56C
}

let ENEMY_POSITION_PATCH_D3 = {
    data: "44 74 A8 7C 44 6D A2 AA 74 56 5A 7B 73 77 7D AA 44 72 19 AD A2 54 49 AC 48 77 73 7A 56 5A A5 AD 4C 64 8C A4 43 01 4C 01 76 00 8D 00 75 02 75 00 75 03 8A 00 43 01 43 03 AB 00 AB 02 35 03 65 03 86 03 8A 02 44 A6 A4 A8 36 87 36 87".split(" "),
    offset: 0x1B840
}

let REMOVE_DOOR_PATCH = {
    data: [],
    offset: 0x1efd8
}

let ADD_FORTRESS_ITEMS = [
    {
        data: [0xD0],
        offset: 0x1e27b,
    },
    {
        data: [0xD0],
        offset: 0x1524c,
    },
    {
        data: [0xD0],
        offset: 0x1e21b,
    },
]

let STR_2_PATCH = [
    {data: [0xee, 0x52, 0x01], offset: 0x6170},
    {data: [0xa9, 0x01, 0x8d, 0x52, 0x01], offset: 0x1eac3},
]

for (var i = 0; i < 181; i++) {
    REMOVE_DOOR_PATCH.data.push("0xff")
}

dungeonLevelOffsets = [0, 0x1b1b8, 0x1b4ac, 0x1b780]

let settings = {
    seed: 0,
    randomizeFortresses1: true,
    randomizeFortresses2: true,
    randomizeFortresses3: true,

    fortress1MinSize: 20,
    fortress1MaxSize: 35,
    fortress1WallChance: 60,
    fortress1MaxUnvisitable: 0,
    fortress1Shops: 1,
    fortress1Hospitals: 1, 
    fortress1Spas: 1,
    fortress1MinimumDistanceToBoss: 5,

    fortress2MinSize: 35,
    fortress2MaxSize: 45,
    fortress2WallChance: 30,
    fortress2MaxUnvisitable: 8,
    fortress2Shops: 2,
    fortress2Hospitals: 1, 
    fortress2Spas: 1,
    fortress2MinimumDistanceToBoss: 7,

    fortress3MinSize: 50,
    fortress3MaxSize: 64,
    fortress3WallChance: 20,
    fortress3MaxUnvisitable: 8,
    fortress3Shops: 3,
    fortress3Hospitals: 1, 
    fortress3Spas: 1,
    fortress3MinimumDistanceToBoss: 10,
}

function getBossHealthPatch(boss1, boss2, boss3) {
    return {
        data: [boss1, boss2, boss3],
        offset: 0x15127
    }
}

//Right now this just uses FBS's text, would like to edit it 
function getTitleTextPatch(lineOne, lineTwo) {

    let extraLetters1 = {
        data: "E6 4C 58 70 58 4C E6 00 00 00 00 00 00 00 00 00".split(" "),
        offset: 0x3b60
    }

    let extraLetters2 = {
        data: "7C 10 10 10 10 10 7C 00 00 00 00 00 00 00 00 00".split(" "),
        offset: 0x3a00
    }

    let extraLetters3 = {
        data: "FE 42 48 78 48 40 E0 00 00 00 00 00 00 00 00 00".split(" "),
        offset: 0x37c0
    }

    let textPatch1 = {
        data: [0x12, 0xb5, 0x9f, 0x12, 0xb6, 0xa7, 0xa6, 0xbf, 0xb7, 0x12],
        offset: 0x63c3
    }

    let textPatch2 = {
        data: [0x65, 0xaf, 0x12, 0x7b, 0x65, 0xc0],
        offset: 0x63e5
    }

    return [extraLetters1, extraLetters2, extraLetters3, textPatch1, textPatch2]
}

function createNewRandomizedRom(skipSpoilers=false, romname, seed = 0, levelsToRandomized = [1,2,3,4], fortressesToRandomize = [1,2,3], difficulty = 1, useFbsLogic=[]) {

    console.log("Randomizing " + levelsToRandomized + " levels, " + fortressesToRandomize + " fortresses, with seed " + seed + ", on difficulty " + difficulty)
    let newFilename = 'ki-' + seed;    
    let newFullFileName = romPath + newFilename + ".nes";
    rp.copyOriginalRom(romname, newFullFileName);

    if (fortressesToRandomize.indexOf(1) > -1){        
        console.log("Generating dungeon 1") 
        var dungeon1Patch = []
        var dungeon1Data = [];
        if (useFbsLogic.indexOf(1) > -1) {
            dungeon1Patch = fbsf.generatePatchForFortress(1, difficulty);
            dungeon1Data = dungeon1Patch[0].data
        } else {
            let dungeon1 = dg.kiDungeonGen(20, 35, 60, 0, 1, 1, 1, 0x29, 5);
            dungeon1Patch = {
                data: dungeon1,
                offset: dungeonLevelOffsets[1]
            }
            dungeon1Data = dungeon1;
            rp.patchRom(ENEMY_POSITION_PATCH_D1, newFullFileName);
        }

        let htmlSpoiler = printMaze(dungeon1Data);
        if(!skipSpoilers){        
            writeHtmlSpoiler(htmlSpoiler, romPath + newFilename + "-1-4.html");
        }
        rp.patchRom(dungeon1Patch, newFullFileName);        
    }

    if (fortressesToRandomize.indexOf(2) > -1){     
        console.log("Generating dungeon 2")

        var dungeon2Data = [];
        var dungeon2Patch = [];
        if(useFbsLogic.indexOf(2) > -1) {
            dungeon2Patch = fbsf.generatePatchForFortress(2, difficulty);
            dungeon2Data = dungeon2Patch[0].data
        } else {
            let dungeon2 = dg.kiDungeonGen(35, 45, 30, 8, 2, 1, 1, 0x0b, 7);
            dungeon2Patch = {
                data: dungeon2,
                offset: dungeonLevelOffsets[2]
            }
            dungeon2Data = dungeon2;
            rp.patchRom(ENEMY_POSITION_PATCH_D2, newFullFileName);
        }       
        
        let htmlSpoiler2 = printMaze(dungeon2Data);   
        rp.patchRom(dungeon2Patch, newFullFileName);   
        if(!skipSpoilers){        
            writeHtmlSpoiler(htmlSpoiler2, romPath + newFilename + "-2-4.html");
        }
    }

    if (fortressesToRandomize.indexOf(3) > -1){     
       console.log("Generating dungeon 3")
        

        var dungeo3Patch = [];
        var dungeon3Data;
        if(useFbsLogic.indexOf(3) > -1) {
            dungeon3Patch = fbsf.generatePatchForFortress(3, difficulty);
            dungeon3Data = dungeon3Patch[0].data
        } else {
            let dungeon3 = dg.kiDungeonGen(50, 64, 20, 8, 3, 1, 1, 0x29, 10)
            dungeon3Patch = {
                data: dungeon3,
                offset: dungeonLevelOffsets[3]
            }
            dungeon3Data = dungeon3;
            rp.patchRom(ENEMY_POSITION_PATCH_D3, newFullFileName);
        }
    
        let htmlSpoiler3 = printMaze(dungeon3Data);
        if(!skipSpoilers){        
            writeHtmlSpoiler(htmlSpoiler3, romPath + newFilename + "-3-4.html");
        }
        rp.patchRom(dungeon3Patch, newFullFileName);
    
    }

    // rp.patchRom(ADD_MAP_PATCH_D14, newFullFileName);
    // rp.patchRom(ADD_MAP_PATCH_D24, newFullFileName);
    // rp.patchRom(ADD_MAP_PATCH_D34, newFullFileName);

    //world 1 randomization
    if (levelsToRandomized.indexOf(1) > -1){
        let world1Patches = fbs.randomizeWorld(1, difficulty);
        rp.patchRom(world1Patches, newFullFileName);
        writeHtmlSpoiler(writeVerticalWorldSpoilers(world1Patches, 1), romPath + newFilename + "-w1.html");
    }

    //world 2 randomization
    if (levelsToRandomized.indexOf(2) > -1){
        let world2Patches = fbs.randomizeWorld(2, difficulty);
        rp.patchRom(world2Patches, newFullFileName);
        writeHtmlSpoiler(writeWorld2Spoilers(world2Patches), romPath + newFilename + "-w2.html");
    }
    
    //world 3 randomization
    if (levelsToRandomized.indexOf(3) > -1){
        let world3Patches = fbs.randomizeWorld(3, difficulty);    
        rp.patchRom(world3Patches, newFullFileName);
        writeHtmlSpoiler(writeVerticalWorldSpoilers(world3Patches, 3), romPath + newFilename + "-w3.html");  
    }
    
    
    if (levelsToRandomized.indexOf(4) > -1){
        let world4Patches = fbs.randomizeWorld(4, difficulty);
        rp.patchRom(world4Patches, newFullFileName);
        writeHtmlSpoiler(writeWorld4Spoilers(world4Patches), romPath + newFilename + "-w4.html");    
    }

    //minor patches
    rp.patchRom(REMOVE_DOOR_PATCH, newFullFileName);
    rp.patchRom(ADD_FORTRESS_ITEMS, newFullFileName);
    rp.patchRom(STR_2_PATCH, newFullFileName);

    rp.patchRom(getBossHealthPatch(100, 100, 100), newFullFileName);
    rp.patchRom(getTitleTextPatch("foo", "bar"), newFullFileName)

    return seed;   
}

function writeHtmlSpoiler(html, filename) {
    console.log("Writing html spoiler: " + filename)
    if (fs.existsSync(filename)) {
        return;
    }

    fs.open(filename, 'a', (err, fd) => {
        if (err) {
            console.log(err)
            return;
        }
        fs.write(fd, html, 0, 'utf-8',(err, writte, str) => {
            console.log("Wrote html spoiler: " + filename)
        });
    })
}

function writeWorld2Spoilers(patches) {
    var htmlSpoiler = '<html><head><link rel="stylesheet" type="text/css" href="../stylesheets/dungeon.css" /></head><body>'
    htmlSpoiler += '<div class="horizontal-level">'
    //The first 3 patches hold the 3 level datas
    for (var index = 0; index < 3; index++) {
        let levelData = patches[index].data;
        var line = '<div class="levelRow">'
        for (var screenIndex = 0; screenIndex < levelData.length; screenIndex = screenIndex + 2) {
            let screen = levelData[screenIndex].toString(16).padStart(2, '0') + "-" + levelData[screenIndex + 1].toString(16).padStart(2, '0') + ".png"
            line += '<div class="levelScreen"><img class="vertImage" src="../images/w2/' + screen + '" /></div>'
        }
        line += "</div>"
        htmlSpoiler += line;
    }

    return htmlSpoiler;
}

function writeWorld4Spoilers(patches) {
    var htmlSpoiler = '<html><head><link rel="stylesheet" type="text/css" href="../stylesheets/dungeon.css" /></head><body>'
    htmlSpoiler += '<div class="horizontal-level">'
    //The first patch hold the 4-1 level datas
    let levelData = patches[0].data;
    var line = '<div class="levelRow">'
    for (var screenIndex = 0; screenIndex < levelData.length; screenIndex = screenIndex + 2) {
        let screen = levelData[screenIndex].toString(16).padStart(2, '0') + "-" + levelData[screenIndex + 1].toString(16).padStart(2, '0') + ".png"
        line += '<div class="levelScreen"><img class="vertImage" src="../images/w4/' + screen + '" /></div>'
    }
    line += "</div>"
    htmlSpoiler += line;

    return htmlSpoiler;
}

function writeVerticalWorldSpoilers(patches, world) {
    
    var htmlSpoiler = '<html><head><link rel="stylesheet" type="text/css" href="../stylesheets/dungeon.css" /></head><body>'
    htmlSpoiler += '<div class="vertical-level">'
    //The first 3 patches hold the 3 level datas
    let worldImages = [[],[],[]]
    for (var index = 0; index < 3; index++) {
        let levelData = patches[index].data;

        for (var screenIndex = 0; screenIndex < levelData.length; screenIndex = screenIndex + 2) {
            
            let screen = levelData[screenIndex].toString(16).padStart(2, '0') + "-" + levelData[screenIndex + 1].toString(16).padStart(2, '0') + ".png"
            worldImages[index][screenIndex] = screen;
        }
    }

    //start from the end
    let largestLevel = Math.max(worldImages[0].length, worldImages[1].length, worldImages[2].length);
    for(var index = largestLevel - 1; index >= 0; index--) {
        if (index%2 == 1) {
            continue;
        }
        var line = "";
        for (var w = 0; w < worldImages.length; w++){
            if (worldImages[w][index] != undefined) {
                line += '<div class="levelScreen"><img class="vertImage" src="../images/w' + world + '/' + worldImages[w][index].toString(16).padStart(2, '0') + '" /></div>'
            } else {
                line += '<div class="levelScreen"><img class="vertImage" src="../images/00.png" /></div>'
            }
            line += '<div class="levelScreen"><img class="vertImage" src="../images/00.png" /></div>'
        }

        htmlSpoiler += line;
    }
    
    htmlSpoiler += "<div></body></html>";
    return htmlSpoiler;
}

function printMaze(mazePatch) {
    var htmlSpoiler = '<html><head><link rel="stylesheet" type="text/css" href="../stylesheets/dungeon.css" /></head><body>'
    htmlSpoiler += '<div class="maze">'
    mazeBytes = mazePatch
    var line = ""
    for (var index = 0; index < 128; index = index + 2) {
        
        var imgName = "";
        var openings = "";
        if(typeof mazeBytes[index] === 'string') {
            imgName = mazeBytes[index].padStart(2, "0") + ".png"      
            openings = parseInt(mazeBytes[index+1], 16);             
        } else {
            imgName = mazeBytes[index].toString(16).padStart(2, "0") + ".png"            
            openings = mazeBytes[index+1];
        }
     

        line += '<div class="room open-' + openings.toString(16).padStart(2, "0") + '">'
        if ((openings & 0x01) == 1) {
            line += '<img class="opening-img" src="../images/open-up.png" />';
        }

        if ((openings & 0x02) == 0x02) {
            line += '<img class="opening-img" src="../images/open-right.png" />';
        }

        if ((openings & 0x04) == 0x04) {
            line += '<img class="opening-img" src="../images/open-down.png" />';
        }

        if ((openings & 0x08) == 0x08) {
            line += '<img class="opening-img" src="../images/open-left.png" />';
        }

        line += '<img class="roomImage" src="../images/' + imgName + '"/></div>'

    }
    htmlSpoiler += line;
    htmlSpoiler += "<div></body></html>";
    return htmlSpoiler;

}

module.exports = {createNewRandomizedRom}
