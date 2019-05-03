let sr = require('./scrolling-level-info')

let screenRules = sr.screenRules
let screens = sr.screens

let stageLength = [[], [0, 12, 14, 20], [0, 27, 30, 30], [0, 11, 14, 16], [0, 13]]

const enemyTableLengths = [0, 47, 87, 52, 13]
const ENEMY_TABLE_START_LOCATIONS = [[0],
 [0x1a626, 0x1a65b, 0x1a68a + 6, 0x1a6bf + 6], 
 [0xbc55, 0xbcb2, 0xbd0f, 0xbd6c], 
 [0x1af87, 0x1afc1, 0x1affb, 0x1b035], 
 [0xff0d]]
const ENEMY_TABLE1 = sr.ENEMY_TABLE1;
const ENEMY_TABLE3 = sr.ENEMY_TABLE3;
const DIFF_EASY = 1;
const DIFF_NORMAL = 2;
const DIFF_HARD = 3;

const SCREEN_NOT_ALLOWED = -1;
const SCREEN_OKAY = 1;
const SCREEN_AWESOME = 2;
const SCREEN_UGLY = 3;
const SCREEN_HARD = 4;

//These are the rooms that the exits start at.  worlds 1, 2, and 3 have 3 possible exits.
const EXITS = [0, 31, 36, 13, 6]

//forced first screen for each of x-1 through x-3
const INITIAL_SCREENS = [[], [0, 28, 29, 30], [0, 33, 34, 35], [0, 11, 11, 12], [0, 1]]
const INVALID_ROOMS =   [[],[28, 29, 30, 31, 32, 33], [36, 37, 38], [13, 14, 15], []]

//x-1 memory addresses            1-1     2-1      3-1     4-1
const STAGE_1_ADDRESSES = [0, 0x1a56a, 0xbb3e, 0x1aef5, 0xfeb6]
const PLATFORM_ADDRESS =  [0, 0x1a4b0, 0xbdc3, 0x1ae3b, 0x0]

function randomizeWorld(world, difficulty) {

    let stage1Address = STAGE_1_ADDRESSES[world]
    let stage2Address = stage1Address + (stageLength[world][1] + 1) * 2
    let stage3Address = stage2Address + (stageLength[world][2] + 1) * 2

    let stageAddresses = [0, stage1Address, stage2Address, stage3Address]

    let patches = [];
    let stagePlans = [[]]
    //Don't include fortresses in length
    let numStages = (world == 4) ? 1 : (stageLength[world].length - 1);
    
    for(var currentStage = 1; currentStage <= numStages; currentStage++) {
        console.log("Randomizing " + world + "-" + currentStage + " difficulty: " + difficulty)
        let stagePlan = []        
        var success = false;    
        while (!success ) {
            success = true;
            let screenUsed = [];
            stagePlan[0] = INITIAL_SCREENS[world][currentStage];
            for (var currentScreen = 1; currentScreen < stageLength[world][currentStage] - 1; currentScreen++) {
                var screenChoice = 0;
                while (screenChoice == 0) {
                    screenChoice = pickScreen(world);
                    let alternateScreenChoice = pickScreen(world);  
                    //see if alternate is awesome
                    let previousScreen = stagePlan[currentScreen - 1];

                    if(screenRules(previousScreen, alternateScreenChoice, world) == SCREEN_AWESOME) {
                        screenChoice = alternateScreenChoice;
                    }

                    if(screenRules(previousScreen, alternateScreenChoice, world) == SCREEN_HARD) {
                        screenChoice = alternateScreenChoice;
                    }

                    //check the rules
                    let allowed = screenRules(previousScreen, screenChoice, world);
                    if(!screenUsed[screenChoice]) {
                        screenUsed[screenChoice] = 0;
                    } else if(screenUsed[screenChoice] > 0) {
                        //If this screen has been used, make it less likely
                        let timesUsed = screenUsed[screenChoice];
                        for (var i = 0; i < timesUsed; i++) {
                            if (Math.random() < .75) {
                                allowed = SCREEN_NOT_ALLOWED;
                            }
                        }
                    }

                    if(screenChoice == (previousScreen + 1)) {
                        if (Math.random() < .75) {
                            allowed = SCREEN_NOT_ALLOWED;
                        } 
                    }

                    if (allowed == SCREEN_NOT_ALLOWED || allowed == SCREEN_UGLY) {
                        screenChoice = 0;
                    } else if (allowed == SCREEN_HARD && difficulty < DIFF_HARD) {
                        screenChoice = 0;
                    }
                }

                stagePlan[currentScreen] = screenChoice;
                screenUsed[screenChoice]++
            }

            //stage successfully randomized, find an exit
            let exitScreen = EXITS[world];
            
            var exitWorks = false;            
            let thisStageLength = stageLength[world][currentStage]
            let secondToLastScreen = stagePlan[thisStageLength - 2]
            //There's something special about world 4 here, I think I skip all this
            if(world == 4) {
                stagePlan[thisStageLength-1] = exitScreen;
                exitWorks = true;
            } else {
                //Each stage has 3 possible exit screens
                for (var possibleExit = exitScreen; possibleExit <= exitScreen + 2; possibleExit++) {               
                    let possibleResult = screenRules(secondToLastScreen, possibleExit, world)
                    if (possibleResult == SCREEN_OKAY || possibleResult == SCREEN_AWESOME || (difficulty == DIFF_HARD && possibleResult == SCREEN_HARD)) {
                        //Exit works!
                        stagePlan[thisStageLength - 1] = possibleExit

                        exitWorks = true;
                        break;
                    }
                }          
            }

            if (!exitWorks) {
                success = false;
            } 
        }
       
        //finished!  create the patch!        
        let patchBytes = []
        stagePlans[currentStage] = stagePlan;        
        for(var i = 0; i < stagePlan.length; i++) {
            let screenToAdd = stagePlan[i];
            patchBytes.push(screens[world][screenToAdd].address1)
            patchBytes.push(screens[world][screenToAdd].address2)
        }

        patches[currentStage-1] = {
            name: "Stage " + world + "-" + currentStage,
            data: patchBytes,
            offset: stageAddresses[currentStage]
        }

    }    
    
    //Enemy for current world/stage
    let enemyTableLength = enemyTableLengths[world]

    let enemyTable1Data = []
    let enemyTable2Data = []
    let enemyTable3Data = []
    let enemyTable4Data = []

    //First table
    for (var currentScreen = 0; currentScreen < enemyTableLength; currentScreen++) {
        if (difficulty == DIFF_EASY && currentScreen == 0) {
            enemyTable1Data.push(0x0)
            enemyTable3Data.push(0x0)
            continue;
        }

        let enemyChoice = ENEMY_TABLE1[world][difficulty][Math.floor(Math.random() * ENEMY_TABLE1[world][difficulty].length)]
        let enemy3Choice = ENEMY_TABLE3[world][difficulty][Math.floor(Math.random() * ENEMY_TABLE3[world][difficulty].length)]

        enemyTable1Data.push(enemyChoice);
        enemyTable3Data.push(enemy3Choice);
    }

    //2nd table, snakes in W2, reapers in 1&3    
    if (world == 2) {
        //2-1
        for(var i = 0; i < stageLength[world][1]; i++) {
            if ([1,4,6,7,24,26,27,28].indexOf(stagePlans[1][i]) > -1) {
                enemyTable3Data[i] = 0x02;
            }
        }
        //2-2
        for(var i = 0; i < stageLength[world][2]; i++) {
            if ([1,4,6,7,24,26,27,28].indexOf(stagePlans[2][i]) > -1) {
                enemyTable3Data[stageLength[world][1] + i] = 0x02;
            } 
        }
        //2-3
        for(var i = 0; i < stageLength[world][3]; i++) {
            if ([1,4,6,7,24,26,27,28].indexOf(stagePlans[3][i]) > -1) {
                enemyTable3Data[stageLength[world][1] + stageLength[world][2] + i] = 0x02;
            }
        }
    } else if (world == 1 || world == 3) {
        for (var currentScreen = 0; currentScreen < enemyTableLength; currentScreen++) {
            if (difficulty == DIFF_EASY && currentScreen == 0) {
                enemyTable2Data.push(0x00);
                enemyTable4Data.push(0x00);
            } else {
                if (Math.floor(Math.random() * 100) + 1 < (difficulty * 5)) {
                    enemyTable2Data.push(0x0d);
                } else {
                    enemyTable2Data.push(0x00);
                }

                if (Math.floor(Math.random() * 100) + 1 < (difficulty * 5)) {
                    enemyTable4Data.push(0x0d);
                } else {
                    enemyTable4Data.push(0x00);
                }
            }
        }
    }

    if (world != 4){
        patches.push({name: "Enemy Table 1 for world " + world, data: enemyTable1Data, offset: ENEMY_TABLE_START_LOCATIONS[world][0]});
        patches.push({name: "Enemy Table 2 for world " + world, data: enemyTable2Data, offset: ENEMY_TABLE_START_LOCATIONS[world][1]});
        patches.push({name: "Enemy Table 3 for world " + world, data: enemyTable3Data, offset: ENEMY_TABLE_START_LOCATIONS[world][2]});
        patches.push({name: "Enemy Table 4 for world " + world, data: enemyTable4Data, offset: ENEMY_TABLE_START_LOCATIONS[world][3]});
    }
    if (world == 1) {
        patches.push(getPatchForWorld1Items(difficulty))
    } else if (world == 2) {
        patches.push(getPatchForWorld2Items(difficulty))
    } else if (world == 3) {
        patches.push(getPatchForWorld3Items(difficulty))
    }
    patches.push(radomizePlatforms(world, difficulty));

    return patches;
}

function pickScreen(world) {
    //todo add seeded randomizer
    var item = screens[world][Math.floor(Math.random()*screens[world].length)];
    while (INVALID_ROOMS[world].indexOf(item.id) > -1) {        
        item = screens[world][Math.floor(Math.random()*screens[world].length)];        
    }

    return item.id;
}


function getPatchForWorld3Items(difficulty) {
    //     'Write items
    // '-----------------------------------------------------------------------
    // print "World 3... "
    // f = freefile
    // open fn for binary as #f


    // 'World 3 items
    let startlocation = 0x1B0CD 
    let patch = {name: "world 3 items", offset: startlocation, data: []}

    // 'move item from 3-3 into 3-2
    // put #f, startlocation+1, cubyte("&h01")
    patch.data.push(0x01);

    // '3-3 item 1 screen
    // put #f, startlocation+2, cubyte("07") '1/2 into stage
    patch.data.push(0x07);

    // '3-3 item 1 Y,X
    // put #f, startlocation+3, cubyte("&h2"+hex(int(rnd*12)+2))
    patch.data.push(Math.floor(Math.random() * 12) + 2);

    // '3-3 item 1 type (0=harp; 1=chalice)    
    if(difficulty == DIFF_EASY) {
        patch.data.push(0x01);
    } else {
        patch.data.push(Math.floor(Math.random() * 2))
    }
    
    return patch;
}


function radomizePlatforms(world, difficulty) {
    //two patches, 1 to remove them all, 1 to randomly add them
    if (world == 4) {
        return {name: "world " + world + " platforms", offset: 0x0, data: []};
    }

    let removalPatch = {name: "world " + world + " platforms", offset: PLATFORM_ADDRESS[world], data: []}
    for (var i = 0; i < 128; i++) {
        removalPatch.data.push(0xff);
    }

    if (world == 2) {
        return removalPatch;
    }

    let locationOptions = [0x37, 0x67, 0x97, 0xC7]
    let addPlatformsPatch = {name: "world " + world + " platforms", offset: PLATFORM_ADDRESS[world], data: []}
    for (var i = 0; i < 32; i++) {
        choice = Math.floor(Math.random() * difficulty) + 1;
        if (choice == 1) {
            let stage = Math.floor(Math.random() * 3);
            let screen = Math.floor(Math.random() * stageLength[world][stage])
            let location = locationOptions[Math.floor(Math.random() * 4)]
            addPlatformsPatch.data.push(stage);
            addPlatformsPatch.data.push(screen);
            addPlatformsPatch.data.push(location);
            addPlatformsPatch.data.push(0x00);
        } else {
            addPlatformsPatch.data.push(0xff);
            addPlatformsPatch.data.push(0xff);
            addPlatformsPatch.data.push(0xff);
            addPlatformsPatch.data.push(0xff);
        }
    }

    return addPlatformsPatch;
}

function getPatchForWorld2Items(difficulty) {        
    let item1 = difficulty == DIFF_EASY ? 0 : Math.floor(Math.random()* 2);
    let item2 = difficulty == DIFF_EASY ? 0 : Math.floor(Math.random()* 2);
    return {
        name: "world 2 items",
        data: [0x13, 0x9e, item1, 0x01, 0x15, 0x9e, item2],
        offset: 0xbc3c
    }
}

function getPatchForWorld1Items(difficulty) { 

    var itemlocations = [0x1a759, 0x1a75d, 0x1a761, 0x1a765,0x1a769, 0x1a76d]
    let patches = []

    for(var i = 0; i < 6; i = i + 2) {
        let screen = Math.floor(stageLength[1][(i+2)/2] / 3);
        
        //Y offset is 0x20, which is 32 in decimal
        let xOffset1 = Math.floor(Math.random() * 12) + 2;
        let coords1 = xOffset1 + 32;        
        let item1 = Math.floor(Math.random()* 2);

        let xOffset2 = Math.floor(Math.random() * 12) + 2;
        let coords2 = xOffset2 + 32;        
        let item2 = difficulty == DIFF_EASY ? 0 : Math.floor(Math.random()* 2);

        let item1Patch = {name: "world 1 item 1", data: [screen, coords1, item1], offset: itemlocations[i]}
        let item2Patch = {name: "world 1 item 2", data: [screen * 2, coords2, item2], offset: itemlocations[i+1]}

        patches.push(item1Patch)
        patches.push(item2Patch)
    }
    
    return patches
}


module.exports = {randomizeWorld, DIFF_EASY, DIFF_NORMAL, DIFF_HARD}
