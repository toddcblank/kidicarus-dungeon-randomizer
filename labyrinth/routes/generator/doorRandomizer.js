
let sr = require('./scrolling-level-info')

//Generates doors for the full world
//requires 3 parameters, which are the patch files for each world
//each world patch should have the stage patch for x-1, x-2, x-3 in 
//array entry 0-2.  if a patch is not passed in the doors will not be present.
function generateRandomizedDoorPatchForLevels(world1patch = [], world2patch = [], world3patch = []) {

    const NOSE_ROOM = 0x22;
    const TRAINING_ROOM = 0x23;
    const UPGRADE_ROOM = 0x24;
    const SHOP = 0x25;
    const BLACK_MARKET = 0x26;
    const EMPTY_OR_SPA = 0x27;

    let doorPatch = {
        name: "Door Patch",
        data: [],
        offset: 0x1efd9,

    }

    levels = []
    levels[0] = []
    levels[1] = [[], world1patch[0].data, world1patch[1].data, world1patch[2].data]
    levels[2] = [[], world2patch[0].data, world2patch[1].data, world2patch[2].data]
    levels[3] = [[], world3patch[0].data, world3patch[1].data, world3patch[2].data]
    
    var doorsToPlacePerWorldLevel = [[],[0, 4, 4, 5], [0,7,8,8], [0,2,3,3]]


    var doorTypes = [NOSE_ROOM, NOSE_ROOM, TRAINING_ROOM, SHOP, SHOP, BLACK_MARKET, EMPTY_OR_SPA]
    var randomWorldUpgrade = Math.floor(Math.random() * 3) + 1
    for (var world = 1; world < 4; world++) {

        //randomize world 1 doors
        var numDoorsToPlace = doorsToPlacePerWorldLevel[world][1] + 
                                doorsToPlacePerWorldLevel[world][2] + 
                                doorsToPlacePerWorldLevel[world][3];
        let doorsToPlace = [];                       
        for (var door = 0; door < numDoorsToPlace; door++) {
            let doorType = doorTypes[Math.floor(Math.random() * doorTypes.length)];
            doorsToPlace.push(doorType);
        }

        //Place 1 upgrade room in world
        doorsToPlace[Math.floor(Math.random() * doorsToPlace.length)] = UPGRADE_ROOM;
        if (randomWorldUpgrade == world) {
            var randomUpgradeRoom = Math.floor(Math.random() * doorsToPlace.length)
            //make sure we're not overwriting the current upgrade room
            while (doorsToPlace[randomUpgradeRoom] == UPGRADE_ROOM) {
                randomUpgradeRoom = Math.floor(Math.random() * doorsToPlace.length)
            }
            doorsToPlace[randomUpgradeRoom] = UPGRADE_ROOM;
        }


        console.log("Placing doors on level " + world + ": " + doorsToPlace)
        for(var x = 1; x <= levels[world].length; x++){
            var screensWithDoors = [];

            while (screensWithDoors.length < doorsToPlacePerWorldLevel[world][x]) {
                //pick a random screen
                let randomScreen = Math.floor((Math.random() * levels[world][x].length)/2)
                var key = (levels[world][x][randomScreen * 2] + (levels[world][x][(randomScreen*2)+1]  << 8)).toString(16)
                screen = sr.screensByWorldAndAddress[world][key]
                console.log("Screen " + key + ":" + JSON.stringify(screen))
                
                if (!screen.door || screen.door == 0x0 || screensWithDoors.indexOf(randomScreen) > -1) {
                    continue;
                }

                //good door location
                screensWithDoors.push(randomScreen)
                doorPatch.data.push(x-1);                     //stage - 1
                doorPatch.data.push(randomScreen);          //screen
                doorPatch.data.push(screen.door);           //door coords
                doorPatch.data.push(doorsToPlace.pop());    //door type
            }
        }
        
        //End of World
        doorPatch.data.push(0xff);
        doorPatch.data.push(0xff);

    }

    //End of World 4 (no doors here silly)
    doorPatch.data.push(0xff);
    doorPatch.data.push(0xff);
    return doorPatch;
}

module.exports = {generateRandomizedDoorPatchForLevels}