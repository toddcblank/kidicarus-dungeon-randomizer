let dg = require('./generate-dungeon')
let rp = require('./rom-patcher')
let romPath = './public/generated-seeds/'
let fs = require('fs')
let fbs = require('./fbs-generator')
let fbsf = require('./fbs-fortress-generator')
let dr = require('./doorRandomizer')
let ipc = require('./itemPriceChanger')

const DOOR_FULL_RANDO_NO_REQS = 1;
const UPGRADES_AT_END = 2;

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
    name: "Remove Doors",
    data: [],
    offset: 0x1efd8
}

let REMOVE_HIDDEN_SCORE_REQ = {
    name: "Removes hidden score requirement from upgrade rooms",
    data: [0xE9, 0x00, 0xAD, 0x35, 0x01, 0xE9, 0x00],
    offset: 0x18ABE
}

let ADD_STR_DOOR_TO_STAGE_1_1 = {
    name: "Adds str upgrade to first screen of 1-1",
    data: [0x00, 0x00, 0x9D, 0x24, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF],
    offset: 0x1efd9
}

let ADD_FORTRESS_ITEMS = [
    
    {
        name: "Invert Torch functionality",
        data: [0xD0],
        offset: 0x1e27b,
    },
    {
        name: "Invert Pencil functionality",
        data: [0xD0],
        offset: 0x1524c,
    },
    {
        name: "Invert Map functionality",
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
        name: "adjusts boss health",
        data: [boss1, boss2, boss3],
        offset: 0x15127
    }
}

//Right now this just uses FBS's text, would like to edit it 
function getTitleTextPatch(seed) {

    //A = D2
    //b = D3
    //C = d4
    //etc

    let alphabet = {
        name: "Adds alphabet to title screen",
        data: "38 44 82 82 FE 82 82 00 00 00 00 00 00 00 00 00 FC 42 42 7C 42 42 FC 00 00 00 00 00 00 00 00 00 7C 82 80 80 80 82 7C 00 00 00 00 00 00 00 00 00 FC 42 42 42 42 42 FC 00 00 00 00 00 00 00 00 00 FE 42 48 78 48 42 FE 00 00 00 00 00 00 00 00 00 FE 42 48 78 48 40 E0 00 00 00 00 00 00 00 00 00 7C 82 80 8E 82 86 7A 00 00 00 00 00 00 00 00 00 C6 44 44 7C 44 44 C6 00 00 00 00 00 00 00 00 00 7C 10 10 10 10 10 7C 00 00 00 00 00 00 00 00 00 0E 04 04 84 84 84 78 00 00 00 00 00 00 00 00 00 E6 4C 58 70 58 4C E6 00 00 00 00 00 00 00 00 00 E0 40 40 40 40 42 FE 00 00 00 00 00 00 00 00 00 82 C6 AA 92 82 82 C6 00 00 00 00 00 00 00 00 00 C6 64 54 54 4C 44 C6 00 00 00 00 00 00 00 00 00 7C 82 82 82 82 82 7C 00 00 00 00 00 00 00 00 00 FC 42 42 7C 40 40 E0 00 00 00 00 00 00 00 00 00 7C 82 82 82 BA 84 7A 00 00 00 00 00 00 00 00 00 FC 42 42 7C 48 4A E6 00 00 00 00 00 00 00 00 00 7C 82 80 78 06 82 7C 00 00 00 00 00 00 00 00 00 FE 92 10 10 10 10 38 00 00 00 00 00 00 00 00 00 82 82 82 82 82 82 7C 00 00 00 00 00 00 00 00 00 82 82 82 82 44 28 10 00 00 00 00 00 00 00 00 00 82 82 92 92 92 AA 44 00 00 00 00 00 00 00 00 00 82 44 28 10 28 44 82 00 00 00 00 00 00 00 00 00 C6 44 28 10 10 10 38 00 00 00 00 00 00 00 00 00 FE 84 08 10 20 42 FE 00 00 00 00 00 00 00 00 00".split(" "),
        offset: 0x3d30,
    }

    const letterLookup = []

    
    letterLookup['0'] = 0x00;    
    letterLookup['1'] = 0x01;
    letterLookup['2'] = 0x02;
    letterLookup['3'] = 0x03;
    letterLookup['4'] = 0x04;
    letterLookup['5'] = 0x05;
    letterLookup['6'] = 0x06;
    letterLookup['7'] = 0x07;
    letterLookup['8'] = 0x08;
    letterLookup['9'] = 0x09;
    
    letterLookup['A'] = 0xd2;
    letterLookup['B'] = 0xd3;
    letterLookup['C'] = 0xd4;
    letterLookup['D'] = 0xd5;
    letterLookup['E'] = 0xd6;
    letterLookup['F'] = 0xd7;
    letterLookup['G'] = 0xd8;
    letterLookup['H'] = 0xd9;
    letterLookup['I'] = 0xda;
    letterLookup['J'] = 0xdb;
    letterLookup['K'] = 0xdc;
    letterLookup['L'] = 0xdd;
    letterLookup['M'] = 0xde;
    letterLookup['N'] = 0xdf;
    letterLookup['O'] = 0xe0;
    letterLookup['P'] = 0xe1;
    letterLookup['Q'] = 0xe2;
    letterLookup['R'] = 0xe3;
    letterLookup['S'] = 0xe4;
    letterLookup['T'] = 0xe5;
    letterLookup['U'] = 0xe6;
    letterLookup['V'] = 0xe7;
    letterLookup['W'] = 0xe8;
    letterLookup['X'] = 0xe9;
    letterLookup['Y'] = 0xea;
    letterLookup['Z'] = 0xeb;
    letterLookup[' '] = 0x12;
    letterLookup["BORDER"] = 0x1f;

    let textPatch1 = {
        name: "Line 1 of title text patch",
        data: [
            letterLookup["K"],
            letterLookup["I"],
            letterLookup["D"],
            letterLookup[" "],
            letterLookup["I"],
            letterLookup["C"],
            letterLookup["A"],
            letterLookup["R"],
            letterLookup["U"],
            letterLookup["S"],
        ],
        offset: 0x63c3
    }

    let textPatch2 = {
        name: "line 2 of title text patch",
        data: [            
            letterLookup["R"],
            letterLookup["A"],
            letterLookup["N"],
            letterLookup["D"],
            letterLookup["O"],
            letterLookup["M"],
            letterLookup["I"],
            letterLookup["Z"],
            letterLookup["E"],
            letterLookup["R"],            
        ],
        offset: 0x63e3
    }

    let textPatch3 = {
        name: "line 3 of title text patch",
        data: [           
            letterLookup["BORDER"], 
            letterLookup["B"],
            letterLookup["Y"],
            letterLookup[" "],
            letterLookup["F"],
            letterLookup["B"],
            letterLookup["S"],
            letterLookup[" "],
            letterLookup["A"],
            letterLookup["N"],
            letterLookup["D"],      
            letterLookup["BORDER"],      
        ],
        offset: 0x6402
    }

    let textPatch4 = {
        name: "line 4 of title text patch",
        data: [            
            letterLookup["R"],
            letterLookup["U"],
            letterLookup["M"],
            letterLookup["B"],
            letterLookup["L"],
            letterLookup["E"],
            letterLookup["M"],
            letterLookup["I"],
            letterLookup["N"],
            letterLookup["Z"], 
            letterLookup["E"],  
            letterLookup["BORDER"],         
        ],
        offset: 0x6422
    }

    let addSeedNamePatch = {
        name: "Add seed name to title screen",
        data: [],
        offset: 0x64c5
    }

    for (var i = 0; i < seed.length; i++) {
        addSeedNamePatch.data.push(letterLookup[seed.charAt(i)])
    }

    return [alphabet, textPatch1, textPatch2, textPatch3, textPatch4, addSeedNamePatch]
}


function createNewRandomizedRom(skipSpoilers=false, romname, seed = 0, levelsToRandomized = [1,2,3,4], fortressesToRandomize = [1,2,3], difficulty = 1, useFbsLogic=[], spoilersOnly = false, doors=DOOR_FULL_RANDO_NO_REQS) {

    console.log("Randomizing " + levelsToRandomized + " levels, " + fortressesToRandomize + " fortresses, with seed " + seed + ", on difficulty " + difficulty)
    console.log("------------------ Testing RNG for seed in Randomization function " + seed + " ------------------------")
    console.log(Math.random())
    console.log(Math.random())
    console.log(Math.random())
    console.log(Math.random())
    console.log("-----------------------------------------------------------------")
    let newFilename = 'ki-' + seed;    
    let newFullFileName = romPath + newFilename + ".nes";
    
    let patchesToApply = []

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
            patchesToApply.push(ENEMY_POSITION_PATCH_D1);
        }

        let htmlSpoiler = printMaze(dungeon1Data);
        if(!skipSpoilers){        
            writeHtmlSpoiler(htmlSpoiler, romPath + newFilename + "-1-4.html");
        }
       patchesToApply.push(dungeon1Patch);        
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
            patchesToApply.push(ENEMY_POSITION_PATCH_D2);
        }       
        
        let htmlSpoiler2 = printMaze(dungeon2Data);   
        patchesToApply.push(dungeon2Patch);   
        if(!skipSpoilers){        
            writeHtmlSpoiler(htmlSpoiler2, romPath + newFilename + "-2-4.html");
        }
    }

    if (fortressesToRandomize.indexOf(3) > -1){     
       console.log("Generating dungeon 3")        

        var dungeon3Patch = [];
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
            patchesToApply.push(ENEMY_POSITION_PATCH_D3);
        }
    
        let htmlSpoiler3 = printMaze(dungeon3Data);
        if(!skipSpoilers){        
            writeHtmlSpoiler(htmlSpoiler3, romPath + newFilename + "-3-4.html");
        }
        patchesToApply.push(dungeon3Patch);
    
    }


    // rp.patchRom(ADD_MAP_PATCH_D14, newFullFileName);
    // rp.patchRom(ADD_MAP_PATCH_D24, newFullFileName);
    // rp.patchRom(ADD_MAP_PATCH_D34, newFullFileName);

    var world1Patches = []
    var world2Patches = []
    var world3Patches = []

    //world 1 randomization
    if (levelsToRandomized.indexOf(1) > -1){
        world1Patches = fbs.randomizeWorld(1, difficulty);
        patchesToApply.push(world1Patches);
       
    }

    //world 2 randomization
    if (levelsToRandomized.indexOf(2) > -1){
        world2Patches = fbs.randomizeWorld(2, difficulty);
        patchesToApply.push(world2Patches);
    }
    
    //world 3 randomization
    if (levelsToRandomized.indexOf(3) > -1){
        world3Patches = fbs.randomizeWorld(3, difficulty);    
        patchesToApply.push(world3Patches);
    }
    
    
    if (doors == DOOR_FULL_RANDO_NO_REQS){
        let doorPatch = dr.generateRandomizedDoorPatchForLevels(world1Patches, world2Patches, world3Patches)
        
        writeHtmlSpoiler(writeVerticalWorldSpoilers(world1Patches, 1, doorPatch), romPath + newFilename + "-w1.html");        
        writeHtmlSpoiler(writeWorld2Spoilers(world2Patches, doorPatch), romPath + newFilename + "-w2.html");
        writeHtmlSpoiler(writeVerticalWorldSpoilers(world3Patches, 3, doorPatch), romPath + newFilename + "-w3.html");  


        patchesToApply.push(doorPatch);
        patchesToApply.push(REMOVE_HIDDEN_SCORE_REQ);
    } else if (doors = UPGRADES_AT_END){
        let doorPatch = dr.addUpgradeDoorsToEndOfLevels();
        patchesToApply.push(doorPatch);
    }


    if (levelsToRandomized.indexOf(4) > -1){
        let world4Patches = fbs.randomizeWorld(4, difficulty);
        patchesToApply.push(world4Patches);
        writeHtmlSpoiler(writeWorld4Spoilers(world4Patches), romPath + newFilename + "-w4.html");    
    }

    //minor patches
    patchesToApply.push(ADD_FORTRESS_ITEMS);
    // patchesToApply.push(STR_2_PATCH);
    // patchesToApply.push(ADD_STR_DOOR_TO_STAGE_1_1);

    // patchesToApply.push(getBossHealthPatch(100, 100, 100));
    patchesToApply.push(getTitleTextPatch(seed));
    patchesToApply.push(ipc.getPricePatch())
    if(!spoilersOnly){
        rp.copyOriginalRom(romname, newFullFileName);
        writePatchFiles(patchesToApply, newFullFileName + ".patches.json");
        rp.patchRom(patchesToApply, newFullFileName)
    }

    return seed;   
}

function writePatchFiles(patches, filename) {
    if (fs.existsSync(filename)){
        return;
    }

    fs.open(filename, 'a', (err, fd) => {
        if (err) {
            console.log(err);
            return;
        }
        fs.write(fd, JSON.stringify(patches, (key, value) => {
            if(typeof value === 'number') {return value.toString(16).padStart(2, "0");}
            else {return value}
        }, 2), 0, 'utf-8',(err, writte, str) => {
            console.log("Wrote patches file: " + filename)
        });
    })
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

function writeWorld2Spoilers(patches, doorPatch) {
    var htmlSpoiler = '<html><head><link rel="stylesheet" type="text/css" href="../stylesheets/dungeon.css" /></head><body>'
    htmlSpoiler += '<div class="horizontal-level">'

    let doors = []
    doors[0] = [];
    doors[1] = [];
    doors[2] = [];
    var currentWorld = 1
    for (var index = 0; index < doorPatch.data.length;) {
        if (doorPatch.data[index] == 0xff) {
            currentWorld++;
            index += 2
            while (doorPatch.data[index] == 0xff){
                index+=2
            }
            continue;
        }        

        if (currentWorld != 2) {            
            index += 4
            continue;
        }

        let level = doorPatch.data[index]
        let screen = doorPatch.data[index + 1]
        let room = doorPatch.data[index + 3]
        doors[level][screen] = room;        
        index += 4
    }

    //The first 3 patches hold the 3 level datas
    for (var index = 0; index < 3; index++) {
        let levelData = patches[index].data;
        var line = '<div class="levelRow">'
        for (var screenIndex = 0; screenIndex < levelData.length; screenIndex = screenIndex + 2) {
            let screen = levelData[screenIndex].toString(16).padStart(2, '0') + "-" + levelData[screenIndex + 1].toString(16).padStart(2, '0') + ".png"
            line += '<div class="levelScreen"><img class="vertImage" src="../images/w2/' + screen + '" /></div>'
        }
        line += "</div>"        
        line += '<div class="levelRow">'
        for (var screenIndex = 0; screenIndex < levelData.length; screenIndex = screenIndex + 2) {
            if (doors[index] && doors[index][Math.floor(screenIndex/2)] !== undefined){
                line += '<div class="levelScreen"><img class="vertImage" src="../images/doors/' + doors[index][Math.floor(screenIndex/2)].toString(16).padStart(2, '0') + '.png" /></div>'
            } else {
                line += '<div class="levelScreen"><img class="vertImage" src="../images/00.png" /></div>'
            }
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

function writeVerticalWorldSpoilers(patches, world, doorPatch) {
    
    var htmlSpoiler = '<html><head><link rel="stylesheet" type="text/css" href="../stylesheets/dungeon.css" /></head><body>'
    htmlSpoiler += '<div class="vertical-level">'
    //The first 3 patches hold the 3 level datas
    let worldImages = [[],[],[]]

    //door patch tells us which screens have doors, we'll add them to the right of the level screen
    let doors = []
    doors[1] = [];
    doors[2] = [];
    doors[3] = [];
    var currentWorld = 1
    for (var index = 0; index < doorPatch.data.length;) {
        if (doorPatch.data[index] == 0xff) {
            currentWorld++;            
            index += 2
            while (doorPatch.data[index] == 0xff){
                index+=2
            }
            continue;
        }        

        if (currentWorld != world) {            
            index += 4
            continue;
        }

        let level = doorPatch.data[index] + 1
        let screen = doorPatch.data[index + 1]
        let room = doorPatch.data[index + 3]
        doors[level][screen] = room;        
        index += 4
    }
    
    for (var index = 0; index < 3; index++) {
        let levelData = patches[index].data;

        for (var screenIndex = 0; screenIndex < levelData.length; screenIndex = screenIndex + 2) {
            
            let screen = levelData[screenIndex].toString(16).padStart(2, '0') + "-" + levelData[screenIndex + 1].toString(16).padStart(2, '0') + ".png"
            worldImages[index][Math.floor(screenIndex/2)] = screen;
        }
    }

    //start from the end
    let largestLevel = Math.max(worldImages[0].length, worldImages[1].length, worldImages[2].length);
    for(var index = largestLevel - 1; index >= 0; index--) {
        
        var line = "";
        for (var w = 0; w < worldImages.length; w++){
            if (worldImages[w][index] != undefined) {
                line += '<div class="levelScreen"><img class="vertImage" src="../images/w' + world + '/' + worldImages[w][index].toString(16).padStart(2, '0') + '" /></div>'
            } else {
                line += '<div class="levelScreen"><img class="vertImage" src="../images/00.png" /></div>'
            }

            if (doors[w+1] && doors[w+1][index] !== undefined){
                line += '<div class="levelScreen"><img class="vertImage" src="../images/doors/' + doors[w+1][index].toString(16).padStart(2, '0') + '.png" /></div>'
            } else {
                line += '<div class="levelScreen"><img class="vertImage" src="../images/00.png" /></div>'
            }
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

module.exports = {createNewRandomizedRom, DOOR_FULL_RANDO_NO_REQS, UPGRADES_AT_END}
