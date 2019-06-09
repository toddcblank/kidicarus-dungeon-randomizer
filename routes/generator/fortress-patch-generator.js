let dr = require('./dungeon-rooms')
let dg = require('./generate-dungeon')
let fbs_fortress = require('./fbs-fortress-generator')

const fortressOffset = [0, 0x1b1b8, 0x1b4ac, 0x1b780]
const bossMusicOffsets = [0, 0x1cba0, 0x1cba1, 0x1cba2]
const centurionOffsets = [0, 0x1b2c4, 0x1b5b8, 0x1b88c]

//Number of rooms that will have centurions.  In the vanilla game,
//1-4 has 28, 2-4 has 32, and 3-4 has 19.
//I chose lower numbers here because our dungeons have fewer
//screens compared to the vanilla game (especially in 1-4).
const centurionAmount = [0, 19, 19, 19]


function generateFortressPatch(world, roomdefinitons=[], fortressAlgorithm, difficulty) {

    //Add any custom rooms to the room definitions
    //We do a deep copy here just to make sure we don't fiddle with the defaults
    let rooms = copy(dr.rooms)
    for (var i = 0; i < roomdefinitons.length; i++) {
        rooms[roomdefinitons[i].roomIdNum] = roomdefinitons[i];
    }

    //generate the layout of the fortress, this uses the algorithm
    //the fortressAlgorithm must create an 8x8 array of rooms with these parameters:
    // var room = {
    //     //Which doors are open
    //     openings: 0xf,        
    //
    //     //Which RoomId
    //     roomId: 0x0D,
    //
    //     //Which Enemy is in the room.  0 is no enemy, 0xf is always the boss, does not have to be populated
    //     //Except for the room that has the boss in it
    //     enemyId: 0x0,
    // }
    var maze;
    
    if(fortressAlgorithm == "FBS") {
        maze = fbs_fortress.generatePatchForFortress(world, difficulty, rooms)
    } else if (fortressAlgorithm == "RUMBLE"){
        if (world == 1) {
            maze = dg.kiDungeonGen(20, 35, 60, 0, 1, 1, 1, 0x29, 5, rooms);
        } else if (world == 2){
            maze = dg.kiDungeonGen(35, 45, 30, 8, 2, 1, 1, 0x0b, 7, rooms);
        } else if (world == 3){
            maze = dg.kiDungeonGen(50, 64, 20, 8, 3, 1, 1, 0x29, 10, rooms)
        }
    }

    
    //generate enemies for all rooms
    placeEnemies(maze, rooms, world, difficulty)

    //generate the room / door parts of the patch
    let mazePatchBytes = getMazePatchBytes(maze);
    let mazePatch = {
        name: "Fortress " + world + " & Enemies",
        data: mazePatchBytes,
        offset: fortressOffset[world]
    }

    //generate a centurion patch
    let centurionPatch = generateCenturionPatch(maze, world, rooms);

    //boss music
    let bossMusicPatch = generateBossMusicPatch(maze, world);

    return [mazePatch, centurionPatch, bossMusicPatch];
}

function generateBossMusicPatch(maze, world) {

    var bossRoomIndex = 0;
    //find the boss room
    for (var y = 0; y < 8; y++) {
        for (var x = 0; x < 8; x++) {
            if (maze[x][y] !== undefined && maze[x][y].enemyId == 0xf0) {
                bossRoomIndex = y * 8 + x;
            }
        }
    }

    return {
        name: "world " + world + " boss music patch",
        data: [bossRoomIndex],
        offset: bossMusicOffsets[world]
    }
}

function generateCenturionPatch(maze, world, rooms) {
    let centurionData = [0x1a, 0x00] //start out with just this (map)
    let numCenturions = 0;
    while (numCenturions < centurionAmount[world]) {
        //get random room
        let randomX = Math.floor(Math.random()*8);
        let randomY = Math.floor(Math.random()*8);        
        let roomIndex = randomY*8+randomX;        
        //check to see if it is a valid room
        let room = maze[randomX][randomY];
        if (room !== undefined) {
            roomId = room.roomId   
            let centurionLocations = rooms[roomId].centurionValidLocations       
            if (centurionLocations !== undefined && centurionLocations.length > 0) {
                let validOptions = centurionLocations.length
                centurionData.push(roomIndex);            
                centurionData.push(centurionLocations[Math.floor(Math.random()*validOptions)]);   
                numCenturions++;
            }                       
        }              
    }             
    centurionData.push(0xff); //End of centurion table

    return {
        name: "Fortress " + world + " Centurion Data",
        data: centurionData,
        offset: centurionOffsets[world]
    }
}

function prettyPrintMaze(maze) {

}

//Utility function to make deep copy of an object
function copy(o) {
    var output, v, key;
    output = Array.isArray(o) ? [] : {};
    for (key in o) {
        v = o[key];
        output[key] = (typeof v === "object") ? copy(v) : v;
    }
    return output;
 }


 function placeEnemies(maze, rooms, world, difficulty) {
    //Queues by difficulty to ensure we get X number of eggplant/hard flyers.  After this is empty we fill with other enemies
    let enemyQueue = [].concat(dr.ENEMY_QUEUES_BY_WORLD_AND_DIFF[world][difficulty])    

    while (enemyQueue.length > 0) {
        let nextEnemeyMask = enemyQueue.pop();
        var placedEnemy = false;
        var attempts = 0;
        while(!placedEnemy) {
            attempts++;
            if (attempts > 100) {
                placedEnemy = true;
                continue;
            }
            //get random room
            let randomX = Math.floor(Math.random()*8);
            let randomY = Math.floor(Math.random()*8);

            let room = maze[randomX][randomY];
            if (room === undefined) {
                //empty room
                continue;
            }

            //check for current enemy
            if(room.enemyId != 0) {
                continue;
            }

            //check if it supports the enemy
            let roomInfo = rooms[room.roomId]

            var roomSupportsEnemy = false;
            var supportedEnemy = 0x0;
            roomInfo.validEnemies.forEach((enemyId) => {
                if ((enemyId & 0xf0) == nextEnemeyMask) {
                    roomSupportsEnemy = true;
                    supportedEnemy = enemyId;
                }
            })
            if (roomSupportsEnemy) {
                placedEnemy = true;
                room.enemyId = supportedEnemy;
            }
        }
    }   

    //now fill any rooms that don't have enemies
    let enemyFiller = [].concat(dr.ENEMY_FILLS_BY_DIFF[difficulty])
    for (var roomIndex = 0; roomIndex < 64; roomIndex++) {
        let room = maze[roomIndex % 8][Math.floor(roomIndex/8)]
        if (room === undefined) {
            continue;
        }

        if (room.enemyId != 0x0) {
            continue;
        }

        

        var enemyPlaced = false;
        var attempts = 0;
        while(!enemyPlaced){        
            let roomInfo = rooms[room.roomId]
            if (roomInfo.validEnemies.length == 0) {
                enemyPlaced = true;
                continue;
            }

            if (roomInfo.validEnemies.length == 1) {
                //This generally only happens with spike rooms.
                room.enemyId = roomInfo.validEnemies[0];
                enemyPlaced = true;
                continue;
            }

            //try to place the next enemy filler
            var enemyToPlace = enemyFiller.shift();

            //put this enemy back at the back of filler
            enemyFiller.push(enemyToPlace);
            attempts++;
                        
            var supportedEnemy = 0x0;
            let supportedEnemies = roomInfo.validEnemies.filter((enemyId) => {
                return (enemyId & 0xf0) == enemyToPlace;
            })

            if(supportedEnemies.length > 0) {
                room.enemyId = supportedEnemies[Math.floor(Math.random() * supportedEnemies.length)];
                enemyPlaced = true;                
            } else if(attempts == enemyFiller.length) {                
                enemyPlaced = true;
            }

        }

    }


    //Simple random
    // for (var x = 0; x < maze.length; x++){
    //     for (var y = 0; y < maze[x].length; y++) {
    //         let room = maze[x][y];
    //         if (room == undefined || room.enemyId != 0) {
    //             continue;
    //         }

    //         roomLayout = rooms[room.roomId];
    //         //console.log(roomLayout)
    //         if (roomLayout.validEnemies.length == 0) {
    //             continue;
    //         }

    //         let enemy = roomLayout.validEnemies[Math.floor(Math.random()*roomLayout.validEnemies.length)]
    //         room.enemyId = enemy
    //     }
    // }
}


function getMazePatchBytes(maze) {    
    var roomBytes = []
    var enemyBytes = [];
    for (var y = 0; y < maze[0].length; y++) {
        for (var x = 0; x < maze.length; x++) {
            let room = maze[x][y];
            if (room == undefined) {
                roomBytes.push(0x0);
                roomBytes.push(0x0);
                enemyBytes.push(0x0);
            } else {
                roomBytes.push(room.roomId);
                roomBytes.push(room.openings);
                enemyBytes.push(room.enemyId);                
            }
        }
    }
    return roomBytes.concat(enemyBytes);
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


module.exports = {generateFortressPatch}