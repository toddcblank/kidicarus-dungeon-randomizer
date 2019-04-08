require('./dungeon-rooms')

const UP = 1
const RIGHT = 2
const DOWN = 4
const LEFT = 8

const DIRECTIONS = [UP, RIGHT, DOWN, LEFT]
const DIR_INDEX = [-1,0,1,-1,2,-1,-1,-1,3]
const RESERVED_ROOMS = [0x10, 0x00, 0x15, 0x16, 0x01, 0x28, 0x29]

var maze = []
let startx = 3, starty = 3;

let xOffSet = []
xOffSet[UP] = 0;
xOffSet[DOWN] = 0;
xOffSet[LEFT] = -1;
xOffSet[RIGHT] = 1;

let yOffSet = []
yOffSet[UP] = -1;
yOffSet[DOWN] = 1;
yOffSet[LEFT] = 0;
yOffSet[RIGHT] = 0;

let oppositeDir = []
oppositeDir[UP] = DOWN;
oppositeDir[DOWN] = UP;
oppositeDir[LEFT] = RIGHT;
oppositeDir[RIGHT] = LEFT;
romPath = './public/generated-seeds/'


//Generates a random dungeon and returns the 64 * 3 bytes for the dungeon and enemies for the dungeon
function kiDungeonGen(minimumSize = 15, maximumSize = 64, wallChance = 35, unvisitableRoomsLimit = 5, numShops = 2, numSpa = 1, numHospital = 1, bossRoomId=0x29) {    
    let xsize = 8;
    let ysize = 8;
    while(true){
        maze = [];
        for (var x = 0; x < xsize; x++) {
            maze[x] = [];
            for (var y = 0; y < ysize; y++) {
                let room = undefined;
                maze[x][y] = room;
            }
        }

        //First room is always set.  
        let startingRoom = makeRoom()
        maze[startx][starty] = startingRoom;
        startingRoom.roomId = 0x01;
        startingRoom.visitedInGeneration = true;
        startingRoom.distanceFromStart = [0,0,0,0]

        //first room can be open everywhere but left, with at least one (1-7)
        let openings = Math.floor(Math.random() * 7 + 1);

        startingRoom.openings = openings;
        if ((openings & UP) == UP) {
            propogate(startx, starty - 1, DOWN, wallChance, maximumSize)
        }
        
        if ((openings & DOWN) == DOWN) {
            propogate(startx, starty + 1, UP, wallChance, maximumSize)
        }

        if ((openings & RIGHT) == RIGHT) {
            propogate(startx + 1, starty, LEFT, wallChance, maximumSize)
        }

        //Add Boss Room
        if(!placeBossRoom(bossRoomId)){
            continue;
        }

        //find x,y of boss room
        let bossCoords = getBossRoom();
        let bossx = bossCoords[0];
        let bossy = bossCoords[1];
        let bossRoom = maze[bossx][bossy];
        
        //populate all the distances from Boss Room
        if ((bossRoom.openings & UP) == UP) {
            bossRoom.distanceFromBoss = [0,-1,-1,-1]
            getDistanceFromBossRoom(bossx, bossy-1, DOWN, 0)
        } else if ((bossRoom.openings & DOWN) == DOWN) {
            bossRoom.distanceFromBoss = [-1,-1,0,-1]
            getDistanceFromBossRoom(bossx, bossy+1, UP, 0)
        } else if ((bossRoom.openings & RIGHT) == RIGHT) {
            bossRoom.distanceFromBoss = [-1,0,-1,-1]
            getDistanceFromBossRoom(bossx+1, bossy, LEFT, 0)
        } else if ((bossRoom.openings & LEFT) == LEFT) {
            bossRoom.distanceFromBoss = [-1,-1,-1,0]
            getDistanceFromBossRoom(bossx-1, bossy, RIGHT, 0)
        }

        //check for illegal paths
        if(!checkPathsToBoss()) {
            continue;
        }

        let unvisitableRooms = checkPathFromStart();
        
        if(unvisitableRooms > unvisitableRoomsLimit) {
            continue;
        }

        //find another spot for the hospital
        for (var i = 0; i < numHospital; i++){placeHospital();}
        for (var i = 0; i < numShops; i++) {placeShop();}
        for (var i = 0; i < numSpa; i++) {placeSpa();}

        placeEnemies();

        let size = getMazeSize();
        if (size > minimumSize){
            console.log("Finished with size of " + size + " & " + unvisitableRooms + " unvisitableRooms")
        }

        if (size >= minimumSize && size <= maximumSize) {         
            // printAllRooms()            
            return printHex();
        }   

    }
}

function printHex() {
    
    var row = ""
    var enemies = "";
    for (var y = 0; y < maze[0].length; y++) {
        for (var x = 0; x < maze.length; x++) {
            let room = maze[x][y];
            if (room == undefined) {
                row = row + "00 00 "
                enemies = enemies + "00 "
            } else {
                row = row + paddedHex(room.roomId) + " " + paddedHex(room.openings) + " "
                enemies = enemies + paddedHex(room.enemyId) + " "
            }
        }
    }

    
    
    let response = (row + enemies).split(" ")
    while (response.length < 128) {
        response.push("00")
    }
    console.log(row + enemies)
    //console.log(response)
    return response
}

function paddedHex(intValue) {
    if (intValue == 0) {
        return "00"
    }
    let hexValue = intValue.toString(16);
    if (hexValue.length == 1) {
        hexValue = "0" + hexValue;
    }
    return hexValue;
}

function placeEnemies() {
    for (var x = 0; x < maze.length; x++){
        for (var y = 0; y < maze[0].length; y++) {
            let room = maze[x][y];
            if (room == undefined || room.enemyId != 0) {
                continue;
            }

            roomLayout = rooms[room.roomId];
            //console.log(roomLayout)
            if (roomLayout.validEnemies.length == 0) {
                continue;
            }

            let enemy = roomLayout.validEnemies[Math.floor(Math.random()*roomLayout.validEnemies.length)]
            room.enemyId = enemy
        }
    }
}

//TODO: make this into a more generic function for seaching for a room to place
function placeRoom(roomId, condition) {

    let xPosistions = shuffle([...Array(maze.length).keys()]);
    

    var roomPlaced = false;
    xPosistions.forEach((x) => {
        let yPosistions = shuffle([...Array(maze[0].length).keys()]);

        yPosistions.forEach((y) => {

            if(roomPlaced) {
                return;
            }

            room = maze[x][y];
            if (condition(room)) {
                room.roomId = roomId
                roomPlaced = true;
            }

            if (room == undefined) {
                return;
            }

            //Don't touch the boss room
            if (room.enemyId == 0xF0) {
                return;
            }

            if ((room.openings & UP) != 0) {
                return;
            }

            //make sure we can reach it
            var roomVisitable = false;
            room.distanceFromStart.forEach((x) => {
                if (x != -1 && x != 999) {
                    roomVisitable = true;                    
                }
            })
            
            if (!roomVisitable) {
                return;
            }

            //should work!
            room.roomId = 0x15;
            //console.log("Making room [" + x + "][" + y + "]  into a hospital")
            roomPlaced = true;
        })    
    })

}

function placeHospital() {

    let xPosistions = shuffle([...Array(maze.length).keys()]);

    var hospitalPlaced = false;
    xPosistions.forEach((x) => {
        let yPosistions = shuffle([...Array(maze[0].length).keys()]);

        yPosistions.forEach((y) => {

            if(hospitalPlaced) {
                return;
            }

            room = maze[x][y];
            if (room == undefined) {
                return;
            }

            //Don't touch the boss room
            if (RESERVED_ROOMS.indexOf(room.roomId) > -1) {
                return;
            }

            if ((room.openings & UP) != 0) {
                return;
            }

            //make sure we can reach it
            var roomVisitable = false;
            room.distanceFromStart.forEach((x) => {
                if (x != -1 && x != 999) {
                    roomVisitable = true;                    
                }
            })
            
            if (!roomVisitable) {
                return;
            }

            //should work!
            room.roomId = 0x15;
            //console.log("Making room [" + x + "][" + y + "]  into a hospital")
            hospitalPlaced = true;
        })    
    })

}

function placeSpa() {

    let xPosistions = shuffle([...Array(maze.length).keys()]);
    

    var spaPlaced = false;
    xPosistions.forEach((x) => {
        let yPosistions = shuffle([...Array(maze[0].length).keys()]);

        yPosistions.forEach((y) => {

            if(spaPlaced) {
                return;
            }

            room = maze[x][y];
            if (room == undefined) {
                return;
            }

            //Don't touch the boss room or hospital
            if (RESERVED_ROOMS.indexOf(room.roomId) > -1) {
                return;
            }

            if ((room.openings & (UP | DOWN)) != 0) {
                return;
            }

            //make sure we can reach it
            var roomVisitable = false;
            room.distanceFromStart.forEach((x) => {
                if (x != -1 && x != 999) {
                    roomVisitable = true;                    
                }
            })
            
            if (!roomVisitable) {
                return;
            }

            //should work!
            room.roomId = 0x28;
            //console.log("Making room [" + x + "][" + y + "]  into a shop")
            spaPlaced = true;
        })    
    })

}

function placeShop() {

    let xPosistions = shuffle([...Array(maze.length).keys()]);
    

    var shopPlaced = false;
    xPosistions.forEach((x) => {
        let yPosistions = shuffle([...Array(maze[0].length).keys()]);

        yPosistions.forEach((y) => {

            if(shopPlaced) {
                return;
            }

            room = maze[x][y];
            if (room == undefined) {
                return;
            }

            //Don't touch the boss room or hospital
            if (RESERVED_ROOMS.indexOf(room.roomId) > -1) {
                return;
            }

            if ((room.openings & UP) != 0) {
                return;
            }

            //make sure we can reach it
            var roomVisitable = false;
            room.distanceFromStart.forEach((x) => {
                if (x != -1 && x != 999) {
                    roomVisitable = true;                    
                }
            })
            
            if (!roomVisitable) {
                return;
            }

            //should work!
            room.roomId = 0x16;
            //console.log("Making room [" + x + "][" + y + "]  into a shop")
            shopPlaced = true;
        })    
    })

}

function shuffle(arra1) {
    var ctr = arra1.length, temp, index;

    // While there are elements in the array
    while (ctr > 0) {
    // Pick a random index
        index = Math.floor(Math.random() * ctr);
    // Decrease ctr by 1
        ctr--;
    // And swap the last element with it
        temp = arra1[ctr];
        arra1[ctr] = arra1[index];
        arra1[index] = temp;
    }
    return arra1;
}

function checkPathFromStart() {
    let startRoom = maze[3][3];
    let directions = [UP, DOWN, RIGHT, LEFT]
    directions.forEach((dir) => {
        
        if ((startRoom.openings & dir) == dir) {
            startRoom.distanceFromStart[DIR_INDEX[dir]] = 0;
            
            traverseMaze(3 + xOffSet[dir], 3 + yOffSet[dir], 0, dir)
        } else {
            startRoom.distanceFromStart[DIR_INDEX[dir]] = -1;
        }
    })

    var unvisitableRooms = 0;
    for (var x = 0; x < maze.length; x++){
        for (var y = 0; y < maze[0].length; y++) {
            let room = maze[x][y];
            if (room == undefined) {
                continue;
            }

            var roomVisitable = false;
            room.distanceFromStart.forEach((x) => {
                if (x != -1 && x != 999) {
                    roomVisitable = true;                    
                }
            })
            if (!roomVisitable) {
                unvisitableRooms = unvisitableRooms + 1;
            }
        }
    }
    return unvisitableRooms;
}


function traverseMaze(x, y, distance, directionFrom) {
    // console.log("Traversing from " + x + ", " + y)

    let room = maze[x][y];    
    let roomLayout = rooms[room.roomId]
    let roomExitDir = oppositeDir[directionFrom];
    room.distanceFromStart[DIR_INDEX[roomExitDir]] = distance

    //anything that connects to direction is distance + 1 and should be recursed
    //anything that isn't open is -1
    let allDirs = [UP, DOWN, LEFT, RIGHT];
    allDirs.forEach((dir) => {
        if (room.distanceFromStart[DIR_INDEX[dir]] <= distance + 1) {
            // console.log("room.distanceFromStart[" + DIR_INDEX[dir] + "] is already done")
            return;
        }

        if ((room.openings & dir) == dir){
            // console.log(room.openings + " is open in " + dir)
            if((roomLayout.paths[DIR_INDEX[roomExitDir]] & dir) == dir){ 
                room.distanceFromStart[DIR_INDEX[dir]] = distance + 1;
                traverseMaze(x + xOffSet[dir], y + yOffSet[dir], distance + 1, dir);
            } else {
                // console.log("roomlayout " + roomLayout.paths[DIR_INDEX[roomExitDir]] + " cant get to " + dir)
            }
        } else {
            room.distanceFromStart[DIR_INDEX[dir]] = -1;
        }
    })

}


function getMazeSize() {
    var size = 0;
    for (var x = 0; x < maze.length; x++){
        for (var y = 0; y < maze[0].length; y++) {
            let room = maze[x][y];
            if (room != undefined) {
                size = size + 1;
            }
        }
    }
    return size;
}

function checkPathsToBoss() {
    for (var x = 0; x < maze.length; x++){
        for (var y = 0; y < maze[0].length; y++) {
            let room = maze[x][y];
            if (room == undefined) {
                continue;
            }

            if (room.distanceFromBoss.indexOf(999) > -1) {
                // console.log("No route to boss from [" + x + "][" + y + "]")
                // console.log(room)
                return false;
            }
        }
    }
    return true;
}

function getBossRoom() {
    for (var x = 0; x < maze.length; x++) {
        for (var y = 0; y < maze[0].length; y++) {
            if (maze[x][y] && maze[x][y].enemyId == 0xF0) {
                return [x,y];
            }
        }
    }
}

function getDistanceFromStart() {

}

function getDistanceFromBossRoom(x, y, exit, distance) {
    // console.log("checking [" + x + "][" + y + "] for distance " + distance + " to exit " + exit)
    let room = maze[x][y];
   

    if ((room.openings &  UP) == UP) {
        if (room.distanceFromBoss[0] > distance + 1) {
            layout = rooms[room.roomId];
            if ((layout.paths[0] & exit) == exit) {
                //valid path, set distance to distance + 1 and recurse
                room.distanceFromBoss[0] = distance + 1;
                getDistanceFromBossRoom(x, y-1, DOWN, distance + 1);
            }
        }
        //that entrance has a faster route already        
    } else{
        //no entrance, just set to -1
        room.distanceFromBoss[0] = -1
    }

    if ((room.openings & DOWN) == DOWN) {
        if (room.distanceFromBoss[2] > distance + 1) {
            layout = rooms[room.roomId];
            if ((layout.paths[2] & exit) == exit) {
                //valid path, set distance to distance + 1 and recurse
                room.distanceFromBoss[2] = distance + 1;
                getDistanceFromBossRoom(x, y+1, UP, distance + 1);
            }
        }
        //that entrance has a faster route already        
    } else{
        //no entrance, just set to -1
        room.distanceFromBoss[2] = -1
    }

    if ((room.openings & RIGHT) == RIGHT) {
        if (room.distanceFromBoss[1] > distance + 1) {
            layout = rooms[room.roomId];
            if ((layout.paths[1] & exit) == exit) {
                //valid path, set distance to distance + 1 and recurse
                room.distanceFromBoss[1] = distance + 1;
                getDistanceFromBossRoom(x+1, y, LEFT, distance + 1);
            }
        }
        //that entrance has a faster route already        
    } else{
        //no entrance, just set to -1
        room.distanceFromBoss[1] = -1
    }

    if ((room.openings & LEFT) == LEFT) {
        if (room.distanceFromBoss[3] > distance + 1) {
            layout = rooms[room.roomId];
            if ((layout.paths[3] & exit) == exit) {
                //valid path, set distance to distance + 1 and recurse
                room.distanceFromBoss[3] = distance + 1;
                getDistanceFromBossRoom(x-1, y, RIGHT, distance + 1);
            }
        }
        //that entrance has a faster route already        
    } else{
        //no entrance, just set to -1
        room.distanceFromBoss[3] = -1
    }

    
}

function placeBossRoom(bossRoomId) {

    //find a spot for the boss, start in a random corner, and look for a dead end.
    //coinflip if we start UP or DOWN
    var xCheck = 0;
    var xCheckDir = 1;
    if (Math.random() > .50) {
        xCheck = maze.length - 1;
        xCheckDir = -1;
    } 

    var yCheck = 0;
    var yCheckDir = 1;
    if (Math.random() > .50) {
        yCheck = maze[0].length - 1;
        yCheckDir = -1;
    }
    
    let yStart = yCheck;

    for(var columnsChecked = 0; columnsChecked < maze.length; columnsChecked++, xCheck = xCheck + xCheckDir){
        for(var rowsChecked = 0; rowsChecked < maze[0].length; rowsChecked++, yCheck = yCheck + yCheckDir){
            roomToCheck = maze[xCheck][yCheck];
            if(roomToCheck != undefined) {
                if (roomToCheck.roomId == 0x01) {
                    continue;
                }
                // console.log("Checking [" + xCheck + "][" + yCheck + "] for possible Boss Room");
                if ([1,2,8].indexOf(roomToCheck.openings) > -1) {
                    // console.log("Using [" + xCheck + "][" + yCheck + "] for boss room!");
                    roomToCheck.roomId = bossRoomId;
                    roomToCheck.enemyId = 0xF0;
                    return true;
                }
                
            }
        }
        yCheck = yStart
    }

    //super unlikely but could happen
   //console.log("No possible boss rooms found")
    return false;
}


function propogate(startx, starty, comingFrom, wallChance) {
    //look and see if the surrounding ones are already populated
    //for any not populated determine if we want 
    startingRoom = maze[startx][starty];
    if (startingRoom === undefined) {
        startingRoom = makeRoom();
        maze[startx][starty] = startingRoom;
    }

    if (startingRoom.visitedInGeneration) {
        return;
    }

    var aboveRoom = belowRoom = leftRoom = rightRoom = undefined;
    var roomOpenings = 0    

    //for now just make it all the same rooms.    
    // startingRoom.roomId = 0x0D;
    startingRoom.roomId = Math.floor(Math.random() * 0x29)
    while (RESERVED_ROOMS.indexOf(startingRoom.roomId) > -1 ||  (rooms[startingRoom.roomId].validEntrances & comingFrom) != comingFrom) {
        startingRoom.roomId = Math.floor(Math.random() * 0x29)
    }
    let room = rooms[startingRoom.roomId]

    if (starty > 0 && (room.validEntrances & UP) == UP) {
        aboveRoom = maze[startx][starty-1]
        if (aboveRoom != undefined && aboveRoom.visitedInGeneration) {
            //room's already there, lets check if it is connecting down
            if ((aboveRoom.openings & DOWN) == DOWN) {
                roomOpenings = roomOpenings | UP;
            }
        } else {
            //randomly decide if we want to connect to UP Let's connect 75% of the time
            let chance = (Math.random() * 100)
            if (chance > wallChance) {
                roomOpenings = roomOpenings | UP;
            }
        }
    }

    if (starty < maze[0].length - 1 && (room.validEntrances & DOWN) == DOWN) {
        belowRoom = maze[startx][starty+1]
        if (belowRoom != undefined && belowRoom.visitedInGeneration) {
            //room's already there, lets check if it is connecting down
            if ((belowRoom.openings & UP) == UP) {
                roomOpenings = roomOpenings | DOWN;
            }
        } else {
            //randomly decide if we want to connect to UP Let's connect 75% of the time
            let chance = (Math.random() * 100)
            if (chance > wallChance) {
                roomOpenings = roomOpenings | DOWN;
            }
        }
    }

    if (startx > 0 && (room.validEntrances & LEFT) == LEFT) {
        leftRoom = maze[startx - 1][starty];
        if (leftRoom != undefined && leftRoom.visitedInGeneration) {
            //room's already there, lets check if it is connecting down
            if ((leftRoom.openings & RIGHT) == RIGHT) {
                roomOpenings = roomOpenings | LEFT;
            }
        } else {
            //randomly decide if we want to connect to UP Let's connect 75% of the time            
            let chance = (Math.random() * 100)
            if (chance > wallChance) {
                roomOpenings = roomOpenings | LEFT;
            }
        }
        
    }

    if (startx < maze.length - 1 && (room.validEntrances & RIGHT) == RIGHT) {
        rightRoom = maze[startx + 1][starty];
        if (rightRoom != undefined && rightRoom.visitedInGeneration) {
            //room's already there, lets check if it is connecting down
            if ((rightRoom.openings & LEFT) == LEFT) {
                roomOpenings = roomOpenings | RIGHT;
            }
        } else {
            //randomly decide if we want to connect to UP Let's connect 75% of the time
            let chance = (Math.random() * 100)
            if (chance > wallChance) {
                roomOpenings = roomOpenings | RIGHT;
            }
        }
    }
    
    startingRoom.openings = roomOpenings;    
    startingRoom.visitedInGeneration = true;

    if ((roomOpenings & UP) == UP) {
        propogate(startx, starty - 1, DOWN, wallChance)
    }
     
    if ((roomOpenings & DOWN) == DOWN) {
        propogate(startx, starty + 1, UP, wallChance)
    }

    if ((roomOpenings & RIGHT) == RIGHT) {
        propogate(startx + 1, starty, LEFT, wallChance)
    }

    if ((roomOpenings & LEFT) == LEFT) {
        propogate(startx - 1, starty, RIGHT, wallChance)
    }
}

function makeRoom() {
    var room = {
        //Which doors are open
        openings: 0xf,        
        roomId: 0x0D,
        visitedInGeneration: false,
        //Diste from boss for each entrance, invalid will be -1 and unchecked entrences will be 999
        distanceFromBoss: [999,999,999,999],
        distanceFromStart: [999,999,999,999],
        enemyId: 0x0,
    }

    return room;
}


module.exports = {kiDungeonGen};