let sr = require('./scrolling-level-info')

let screenRules = sr.screenRules
let screens = sr.screens

let stageLength = [[], [0, 12, 14, 20], [0, 27, 30, 30], [0, 11, 14, 16], [0, 13]]

const enemyTableLengths = [0, 47, 87, 52, 13]
const ENEMY_TABLE_START_LOCATIONS = [[0],
 [0x1a626, 0x1a65b, 0x1a68a + 6, 0x1a6bf + 6], 
 [0xbc55, 0xbcb2, 0xbd0f, 0xbd6c], 
 [0x1af87, 0x1afc1, 0x1affb, 0x1b035], 
 [0xff0d, 0xff22]]
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
    
    var screensWithPlatforms = 0; 
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

                    if (screens[world][screenChoice].platforms && screensWithPlatforms >= 8) {
                        screenChoice = 0;
                        continue;
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

                    //Make the 3-x start screens possible, but rare
                    if (world == 3 && (screenChoice == 11 || screenChoice == 12)) {
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

                if (screens[world][screenChoice].platforms) {
                    screensWithPlatforms++;
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
        if (enemyChoice == sr.ENEMY_REAPER) {
            //Enemy is a reaper, table 2 holds it position (put in upper left)
            enemyTable2Data.push((4 << 4) + Math.floor(Math.random()*8));
        } else {
            enemyTable2Data.push(0x00);
        }
        if (enemy3Choice == sr.ENEMY_REAPER) {
            //Enemy is a reaper, table 2 holds it position (put in lower right)
            enemyTable4Data.push((12 << 4) + Math.floor(Math.random()*8) + 7);
        } else {
            enemyTable4Data.push(0x00);
        }
        
    }

    if (world == 2 || world == 3) {
        //place 1 thief in each level
        var offset = 0;
        for (var i = 1; i <= 3; i++) {
            let thiefLocation = Math.floor(Math.random() * stageLength[world][i]) + offset;

            //Technically this should be ENEMY_PLUTON_FLY for World 3, but they're the same id
            enemyTable1Data[thiefLocation] = sr.ENEMY_PLUTON;

            offset = offset + stageLength[world][i]
        }        
    }


    //2nd table, snakes in W2, reapers in 1&3    
    if (world == 2) {
        //2-1
        for(var i = 0; i < stageLength[world][1]; i++) {
            if ([1,4,6,7,24,26,27,28,40].indexOf(stagePlans[1][i]) > -1) {
                enemyTable3Data[i] = 0x02;
            }
        }
        //2-2
        for(var i = 0; i < stageLength[world][2]; i++) {
            if ([1,4,6,7,24,26,27,28,40].indexOf(stagePlans[2][i]) > -1) {
                enemyTable3Data[stageLength[world][1] + i] = 0x02;
            } 
        }
        //2-3
        for(var i = 0; i < stageLength[world][3]; i++) {
            if ([1,4,6,7,24,26,27,28,40].indexOf(stagePlans[3][i]) > -1) {
                enemyTable3Data[stageLength[world][1] + stageLength[world][2] + i] = 0x02;
            }
        }
    } 

    if (world != 4){
        patches.push({name: "Enemy Table 1 for world " + world, data: enemyTable1Data, offset: ENEMY_TABLE_START_LOCATIONS[world][0]});
        patches.push({name: "Enemy Table 2 for world " + world, data: enemyTable2Data, offset: ENEMY_TABLE_START_LOCATIONS[world][1]});
        patches.push({name: "Enemy Table 3 for world " + world, data: enemyTable3Data, offset: ENEMY_TABLE_START_LOCATIONS[world][2]});
        patches.push({name: "Enemy Table 4 for world " + world, data: enemyTable4Data, offset: ENEMY_TABLE_START_LOCATIONS[world][3]});
    } else {
        patches.push({name: "Enemy Table 1 for world " + world, data: enemyTable1Data, offset: ENEMY_TABLE_START_LOCATIONS[world][0]});
        patches.push({name: "Enemy Table 2 for world " + world, data: enemyTable3Data, offset: ENEMY_TABLE_START_LOCATIONS[world][1]});               
    }
    if (world == 1) {
        patches.push(getPatchForWorld1Items(difficulty, stagePlans))
    } else if (world == 2) {
        patches.push(getPatchForWorld2Items(difficulty, stagePlans))
    } else if (world == 3) {
        patches.push(getPatchForWorld3Items(difficulty, stagePlans))
    }
    patches.push(radomizePlatforms(world, difficulty, stagePlans));

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


function getPatchForWorld3Items(difficulty, stagePlans) {
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

    let itemscreen = 0x07     
    let screenType = stagePlans[2][itemscreen]    
    let screen = sr.screens[3][screenType]
    let coords = screen.item
    
    // '3-3 item 1 screen
    // put #f, startlocation+2, cubyte("07") '1/2 into stage
    patch.data.push(itemscreen);

    // '3-3 item 1 Y,X
    // put #f, startlocation+3, cubyte("&h2"+hex(int(rnd*12)+2))
    patch.data.push(coords);

    // '3-3 item 1 type (0=harp; 1=chalice)    
    if(difficulty == DIFF_EASY) {
        patch.data.push(0x01);
    } else {
        patch.data.push(Math.floor(Math.random() * 2))
    }
    
    return patch;
}


function radomizePlatforms(world, difficulty, plan) {
    //two patches, 1 to remove them all, 1 to randomly add them
    if (world == 4) {
        return {name: "world " + world + " platforms", offset: 0x0, data: []};
    }

    let removalPatch = {name: "world " + world + " platforms", offset: PLATFORM_ADDRESS[world], data: []}
    for (var i = 0; i < 128; i++) {
        removalPatch.data.push(0xff);
    }

    let addPlatformsPatch = {name: "world " + world + " platforms", offset: PLATFORM_ADDRESS[world], data: []}
    
    let platformData = []
    for (var i = 0; i < 128; i++) {
        platformData.push(0xff)
    }

    var currentPlatformBank = 0;
    let platformBanks = [[],[],[],[]]
    for (var level = 0; level < plan.length; level++) {
        for (var screen = 0; screen < plan[level].length; screen++){
            let room = sr.screens[world][plan[level][screen]];
            if (room.platforms) {

                for (var pi = 0; pi < room.platforms.length; pi++) {
                    let platform = room.platforms[pi];
                    platformBanks[currentPlatformBank].push(level - 1)
                    platformBanks[currentPlatformBank].push(screen + platform.offset)
                    platformBanks[currentPlatformBank].push(platform.location)
                    platformBanks[currentPlatformBank].push(0x0)
                    currentPlatformBank = (currentPlatformBank + 1)%4
                }
            }
        }
    }

    for (var i = 0; i < platformBanks.length; i++){
        for(var x = 0; x < platformBanks[i].length; x++) {
            //these need to be 32 bytes apart
            platformData[x + (32 * i)] = platformBanks[i][x];
        }
    }

    addPlatformsPatch.data = platformData

    // for (var i = 0; i < 32; i++) {
    //     choice = Math.floor(Math.random() * difficulty) + 1;
    //     if (choice == 1) {
    //         let stage = Math.floor(Math.random() * 3);
    //         let screen = Math.floor(Math.random() * stageLength[world][stage])
    //         let location = locationOptions[Math.floor(Math.random() * 4)]
    //         addPlatformsPatch.data.push(stage);
    //         addPlatformsPatch.data.push(screen);
    //         addPlatformsPatch.data.push(location);
    //         addPlatformsPatch.data.push(0x00);
    //     } 
    // }

    

    return addPlatformsPatch;
}

function getPatchForWorld2Items(difficulty, stagePlans) {        
    let item1 = difficulty == DIFF_EASY ? 0 : Math.floor(Math.random()* 2);
    let item2 = difficulty == DIFF_EASY ? 0 : Math.floor(Math.random()* 2);
    let item1screen = 0x0D //in stage 2-1
    let item2screen = 0x0F //in stage 2-2
    
    let screen1Type = stagePlans[1][item1screen]
    let screen2Type = stagePlans[2][item2screen]
    
    let screen1 = sr.screens[2][screen1Type]
    let screen2 = sr.screens[2][screen2Type]    
    
    let coords1 = screen1.item
    let coords2 = screen2.item    
    
    return {
        name: "world 2 items",
        data: [item1screen, coords1, item1, 0x01, item2screen, coords2, item2],
        offset: 0xbc3c
    }    
}

function getPatchForWorld1Items(difficulty, stagePlans) { 

    var itemlocations = [0x1a759, 0x1a75d, 0x1a761, 0x1a765, 0x1a769, 0x1a76d]
    let patches = []

    for(var i = 0; i < 6; i = i + 2) {
        let screen = Math.floor(stageLength[1][(i+2)/2] / 3);
        
        let screen1Type = stagePlans[(Math.floor(i/2) + 1)][screen]
        let screen2Type = stagePlans[(Math.floor(i/2) + 1)][screen*2]
                       
        let item1 = Math.floor(Math.random()* 2);
        let screen1 = sr.screens[1][screen1Type]
        let coords1 = screen1.item

        let item2 = difficulty == DIFF_EASY ? 0 : Math.floor(Math.random()* 2);
        let screen2 = sr.screens[1][screen2Type]
        let coords2 = screen2.item

        let item1Patch = {name: "world 1-" + (Math.floor(i/2) + 1) + " item 1", data: [screen, coords1, item1], offset: itemlocations[i]}
        let item2Patch = {name: "world 1-" + (Math.floor(i/2) + 1) + " item 2", data: [screen * 2, coords2, item2], offset: itemlocations[i+1]}
        
        console.log("ITEM: 1-" + (Math.floor(i/2) + 1) + " item 1 on screen " + screen + " (type " + screen1Type + ") COORDS: " + coords1.toString(16))
        console.log("ITEM: 1-" + (Math.floor(i/2) + 1) + " item 2 on screen " + screen*2+" (type " + screen2Type + ") COORDS: " + coords2.toString(16))

        patches.push(item1Patch)
        patches.push(item2Patch)
    }
    
    return patches
}


module.exports = {randomizeWorld, DIFF_EASY, DIFF_NORMAL, DIFF_HARD}
