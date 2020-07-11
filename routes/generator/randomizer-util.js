let dg = require('./generate-dungeon')
let rp = require('./rom-patcher')
let romPath = './public/generated-seeds/'
let fs = require('fs')
let fbs = require('./fbs-generator')
let fbsf = require('./fbs-fortress-generator')
let dr = require('./doorRandomizer')
let ipc = require('./itemPriceChanger')
let textPatches = require('./textPatches')

let newrooms = require('./new-rooms')
let fortressPatchGenerator = require('./fortress-patch-generator')

const DOOR_FULL_RANDO_NO_REQS = 1;
const UPGRADES_AT_END = 2;

//This causes the password checking algorithm to just look at fake data, and error out.
let BREAK_PASSWORDS = [
    {
        name: "Break passwords 1",
        data: [0x00, 0x20],
        offset: 0x6c03
    },
    {
        name: "Break passwords 2",
        data: [0x00, 0x20],
        offset: 0x6c19
    }
]

const ENEMY_POSITION_DATA = [
    0x44, 0x74, 0xA8, 0x7C,                                    //Red/Blue Ground enemies 30 - 38, 40 - 48
    0x44, 0x6D, 0xA2, 0xAA, 
    0x74, 0x56, 0x5A, 0x7B, 
    0x73, 0x77, 0x7D, 0xAA, 
    0x44, 0xA3, 0x19, 0xAD, 
    0xA2, 0x54, 0x49, 0xAC, 
    0x48, 0x77, 0x73, 0x7A, 
    0x56, 0x5A, 0xA5, 0xAD, 
    0x4C, 0x64, 0x8C, 0xA4, 
    0x43, 0x01, 0x4C, 0x01, 0x76, 0x00, 0x8D, 0x00,             //Spikes
    0x75, 0x02, 0x75, 0x00, 0x75, 0x03, 0x8A, 0x00, 
    0x83, 0x01, 0x86, 0x01, 0x89, 0x01, 0x8C, 0x01, 
    0x35, 0x03, 0x65, 0x03, 0x86, 0x03, 0x8A, 0x02, 
    0x44, 0xA6,                                                 //Eggplant Wizards 60-63
    0xA5, 0xAA,     //Good for rooms with flat bottom
    0x35, 0x87, 
    0x78, 0x78
]
let FAST_TEXT_PATCH = [
    {
        name: "Fast Text in Shops and End of Level",
        data: [0x01],
        offset: 0x195F2
    }
]

//Score we need to set so players don't lose health upgrades
let HEALTH_UPGRADE_VALUES = [
    [0x00, 0x00, 0x00], //0
    [0x20, 0x4e, 0x00], //20k
    [0x50, 0xc3, 0x00], //50k
    [0xA0, 0x86, 0x01], //100k
    [0x40, 0x0d, 0x03], //200k
]

let DEFAULT_STR_AND_HEALTH = [

    // {
    //     name: "Death Cleanup Additions New Jump",
    //     data: [0x4C, 0x00, 0xF3, 0xEA, 0xEA, 0xEA, 0xEA, 0xEA, 0xEA, 0xEA, 0xEA],
    //     offset: 0x1EAC5   

    // },{
    //     name: "Additional Cleanup",
    //     data: [           
    //         //Original Instructions
    //         // 0xAD, 0x70, 0x01,  // LDA $0170                
    //         // 0x85, 0xAA,        // STA $AA                  
    //         // 0xAD, 0x71, 0x01,  // LDA $0171                
    //         // 0x85, 0xA6,        // STA $A6 
    //         // Set health to 5 full bars   
    //         0xA9, 0x05,
    //         0x8D, 0x70, 0x01,     
    //         0xA9, 0x05,          
    //         0x8D, 0x6B, 0x01,   //full ammo
    //         0xA9, 0x27,
    //         0x8D, 0xA6, 0x00,              
    //         0x60               //RTS
    //     ],
    //     offset: 0x1F310
    // },
    {
        name: "Initialization Additions New Jump",
        data: [0x4C, 0x00, 0xF5, 0xEA],
        offset: 0x6173
    },
    {
        name: "Additional Initialization",
        data: [
            //0 - 18
            // Set health to 5 full bars   
            0xA9, 0x05,
            0x8D, 0x70, 0x01,            
            0x8D, 0xAA, 0x00,   
            0x8D, 0x6B, 0x01,   
            0x8D, 0x52, 0x01,  

            0xA9, 0x27,
            0x8D, 0xA6, 0x00,    

            //19 - 26
            //score byte 1
            0xA9, 0x20, 
            0x8D, 0x44, 0x01,
            0x8D, 0x5d, 0x01,

            //27 - 34
            //score byte 2
            0xA9, 0x4e, 
            0x8D, 0x45, 0x01,
            0x8D, 0x5e, 0x01,

            //35 - 42
            //score byte 1
            0xA9, 0x00, 
            0x8D, 0x46, 0x01,
            0x8D, 0x5f, 0x01,

            //Give them 2 feathers too
            0xA9, 0x02,
            0x8D, 0x50, 0x01,
            0x8D, 0x69, 0x01,

            0xA9, 0x00, 0x85, 0x38, // LDA $#00, STA $38; Original instruction
            0x4C, 0x67, 0xA1, // JMP 0xA167 Back where I was 
        ],
        offset: 0x1F510
    },
]

let ENEMY_POSITION_PATCH_D1 = {
    name: "Fortress 1 Enemy Position",
    data: ENEMY_POSITION_DATA,
    offset: 0x1B278
}

let ENEMY_POSITION_PATCH_D2 = {
    name: "Fortress 2 Enemy Position",
    data: ENEMY_POSITION_DATA,
    offset: 0x1B56C
}

let ENEMY_POSITION_PATCH_D3 = {    
    name: "Fortress 3 Enemy Position",
    data: ENEMY_POSITION_DATA,
    offset: 0x1B840
}

let REMOVE_HIDDEN_SCORE_REQ = {
    name: "Removes hidden score requirement from upgrade rooms",
    data: [0xE9, 0x00, 0xAD, 0x35, 0x01, 0xE9, 0x00],
    offset: 0x18ABE
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


dungeonLevelOffsets = [0, 0x1b1b8, 0x1b4ac, 0x1b780]


function getDefaultHealthAndStrPatch(extraHealthBars, str) {
    let basePatch = DEFAULT_STR_AND_HEALTH;

    basePatch[1].data[1] = extraHealthBars
    basePatch[1].data[20] = HEALTH_UPGRADE_VALUES[extraHealthBars][0]    
    basePatch[1].data[28] = HEALTH_UPGRADE_VALUES[extraHealthBars][1]
    basePatch[1].data[36] = HEALTH_UPGRADE_VALUES[extraHealthBars][2]

    return basePatch;
}

function getBossHealthPatch(boss1, boss2, boss3) {
    return {
        name: "adjusts boss health",
        data: [boss1, boss2, boss3],
        offset: 0x15127
    }
}

function createNewRandomizedRom(raceMode=false, romname, seed = 0, levelsToRandomized = [1,2,3,4], fortressesToRandomize = [1,2,3], difficulty = 1, useFbsLogic=[], spoilersOnly = false, doors=DOOR_FULL_RANDO_NO_REQS, useNewRooms = false) {

    console.log("Randomizing " + levelsToRandomized + " levels, " + fortressesToRandomize + " fortresses, with seed " + seed + ", on difficulty " + difficulty)
    let newFilename = 'ki-' + seed;    
    let newFullFileName = romPath + newFilename + ".nes";
    
    let patchesToApply = []
    var roomInfo = [];
    if (useNewRooms) {
        roomInfo = newrooms.NEW_ROOM_INFO;
    }

    if (fortressesToRandomize.indexOf(1) > -1){        
        console.log("Generating dungeon 1") 
        var dungeon1Patch = []
        var dungeon1Data = [];
        if (useFbsLogic.indexOf(1) > -1) {
            
            dungeon1Patch = fortressPatchGenerator.generateFortressPatch(1, roomInfo, "FBS", difficulty)
            // dungeon1Patch = fbsf.generatePatchForFortress(1, difficulty, roomInfo);
            dungeon1Data = dungeon1Patch[0].data
        } else {
            dungeon1Patch = fortressPatchGenerator.generateFortressPatch(1, roomInfo, "RUMBLE", difficulty)
            dungeon1Data = dungeon1Patch[0].data;
        }

        let htmlSpoiler = printMaze(dungeon1Data);
        if(!raceMode){        
            writeHtmlSpoiler(htmlSpoiler, romPath + newFilename + "-1-4.html", raceMode);
        }
       patchesToApply.push(dungeon1Patch);        
    }

    if (fortressesToRandomize.indexOf(2) > -1){     
        console.log("Generating dungeon 2")

        var dungeon2Data = [];
        var dungeon2Patch = [];
        if(useFbsLogic.indexOf(2) > -1) {
            dungeon2Patch = fortressPatchGenerator.generateFortressPatch(2, roomInfo, "FBS", difficulty);
            dungeon2Data = dungeon2Patch[0].data
        } else {
            dungeon2Patch = fortressPatchGenerator.generateFortressPatch(2, roomInfo, "RUMBLE", difficulty)
            dungeon2Data = dungeon2Patch[0].data;
        }       
        
        let htmlSpoiler2 = printMaze(dungeon2Data);   
        patchesToApply.push(dungeon2Patch);   
        if(!raceMode){        
            writeHtmlSpoiler(htmlSpoiler2, romPath + newFilename + "-2-4.html", raceMode);
        }
    }

    if (fortressesToRandomize.indexOf(3) > -1){     
       console.log("Generating dungeon 3")        

        var dungeon3Patch = [];
        var dungeon3Data;
        if(useFbsLogic.indexOf(3) > -1) {
            dungeon3Patch = fortressPatchGenerator.generateFortressPatch(3, roomInfo, "FBS", difficulty)
            // dungeon3Patch = fbsf.generatePatchForFortress(3, difficulty, roomInfo);
            dungeon3Data = dungeon3Patch[0].data
        } else {
            dungeon3Patch = fortressPatchGenerator.generateFortressPatch(3, roomInfo, "RUMBLE", difficulty)
            dungeon3Data = dungeon3Patch[0].data;
        }
    
        let htmlSpoiler3 = printMaze(dungeon3Data);
        if(!raceMode){        
            writeHtmlSpoiler(htmlSpoiler3, romPath + newFilename + "-3-4.html", raceMode);
        }
        patchesToApply.push(dungeon3Patch);
    
    }

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
    
    if (difficulty == 1) {
        patchesToApply.push(getDefaultHealthAndStrPatch(1,1))
    }

    patchesToApply.push(FAST_TEXT_PATCH)

    
    if (doors == DOOR_FULL_RANDO_NO_REQS){
        let doorPatch = dr.generateRandomizedDoorPatchForLevels(world1Patches, world2Patches, world3Patches)
        
        writeHtmlSpoiler(writeVerticalWorldSpoilers(world1Patches, 1, doorPatch), romPath + newFilename + "-w1.html", raceMode);        
        writeHtmlSpoiler(writeWorld2Spoilers(world2Patches, doorPatch), romPath + newFilename + "-w2.html", raceMode);
        writeHtmlSpoiler(writeVerticalWorldSpoilers(world3Patches, 3, doorPatch), romPath + newFilename + "-w3.html", raceMode);  

        patchesToApply.push(doorPatch);
        patchesToApply.push(REMOVE_HIDDEN_SCORE_REQ);
    } else if (doors = UPGRADES_AT_END){
        let doorPatch = dr.addUpgradeDoorsToEndOfLevels();
        patchesToApply.push(doorPatch);
    }


    if (levelsToRandomized.indexOf(4) > -1){
        let world4Patches = fbs.randomizeWorld(4, difficulty);
        patchesToApply.push(world4Patches);
        writeHtmlSpoiler(writeWorld4Spoilers(world4Patches), romPath + newFilename + "-w4.html", raceMode);    
    }

    //minor patches
    patchesToApply.push(ADD_FORTRESS_ITEMS);

    // If we want to adjust boss health, we can do so here.
    // patchesToApply.push(getBossHealthPatch(100, 100, 100));
    patchesToApply.push(textPatches.getTitleTextPatch(seed));
    patchesToApply.push(textPatches.getEndingTextPatch(seed));    
    patchesToApply.push(ipc.getPricePatch());
    patchesToApply.push(ENEMY_POSITION_PATCH_D1);
    patchesToApply.push(ENEMY_POSITION_PATCH_D2);
    patchesToApply.push(ENEMY_POSITION_PATCH_D3);
    if (useNewRooms){
        patchesToApply.push(newrooms.getRoomPatches())
    }

    if (raceMode) {
        patchesToApply.push(BREAK_PASSWORDS);
    }

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

function writeHtmlSpoiler(html, filename, raceMode) {
    if (raceMode) {
        return;
    }
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

        console.log("Gathering images for " + JSON.stringify(patches[index]))
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
            line += '<img class="opening-img" src="../images/fortresses/open-up.png" />';
        }

        if ((openings & 0x02) == 0x02) {
            line += '<img class="opening-img" src="../images/fortresses/open-right.png" />';
        }

        if ((openings & 0x04) == 0x04) {
            line += '<img class="opening-img" src="../images/fortresses/open-down.png" />';
        }

        if ((openings & 0x08) == 0x08) {
            line += '<img class="opening-img" src="../images/fortresses/open-left.png" />';
        }
        
        var enemy = mazeBytes[Math.floor(index/2) + 128];
        if (enemy != 0x00 && ((enemy & 0xf0) != 0x50)) {
            line += '<img class="opening-img" src="../images/enemies/' + enemy.toString(16) + '.png" />';
        }
        line += '<img class="roomImage" src="../images/fortresses/' + imgName + '"/></div>'

    }
    htmlSpoiler += line;
    htmlSpoiler += "<div></body></html>";
    return htmlSpoiler;

}

module.exports = {createNewRandomizedRom, DOOR_FULL_RANDO_NO_REQS, UPGRADES_AT_END}
