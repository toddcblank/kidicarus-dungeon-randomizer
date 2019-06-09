let dr = require('./dungeon-rooms')
const UP = dr.UP;
const RIGHT = dr.RIGHT;
const DOWN = dr.DOWN;
const LEFT = dr.LEFT;
const ALL = dr.ALL;
const NONE = dr.NONE;
const DIRECTIONS = dr.DIRECTIONS;
const DIR_INDEX = dr.DIR_INDEX;

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


//Generates a random dungeon and returns the 64 * 3 bytes for the dungeon and enemies for the dungeon
function kiDungeonGen(minimumSize = 15, maximumSize = 64, wallChance = 35, unvisitableRoomsLimit = 5, numShops = 2, numSpa = 1, numHospital = 1, bossRoomId=0x29, minimumDistanceToBoss=0, roomList = dr.rooms) {    

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
        if (openings & UP) {
            propogate(startx, starty - 1, wallChance, roomList)
        }
        
        if (openings & DOWN) {
            propogate(startx, starty + 1, wallChance, roomList)
        }

        if (openings & RIGHT) {
            propogate(startx + 1, starty, wallChance, roomList)
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
            getDistanceFromBossRoom(bossx, bossy-1, DOWN, 0, roomList)
        } else if ((bossRoom.openings & DOWN) == DOWN) {
            bossRoom.distanceFromBoss = [-1,-1,0,-1]
            getDistanceFromBossRoom(bossx, bossy+1, UP, 0, roomList)
        } else if ((bossRoom.openings & RIGHT) == RIGHT) {
            bossRoom.distanceFromBoss = [-1,0,-1,-1]
            getDistanceFromBossRoom(bossx+1, bossy, LEFT, 0, roomList)
        } else if ((bossRoom.openings & LEFT) == LEFT) {
            bossRoom.distanceFromBoss = [-1,-1,-1,0]
            getDistanceFromBossRoom(bossx-1, bossy, RIGHT, 0, roomList)
        }

        //check for illegal paths
        if(!checkPathsToBoss()) {
            continue;
        }

        var meetsMinimumBossDistance = true;
        var startingDistance;
        startingRoom.distanceFromBoss.forEach((x) => {
            if (x < minimumDistanceToBoss && x != -1) {
                startingDistance = x;
                meetsMinimumBossDistance = false;                
            }
        })

        if (!meetsMinimumBossDistance) {      
            // console.log("Too close to boss (" + startingDistance + ")")              
            continue;
        }

        let unvisitableRooms = checkPathFromStart(roomList);
        
        if(unvisitableRooms > unvisitableRoomsLimit) {
            // console.log("Too many unvisitable rooms (" + unvisitableRooms + ")")
            continue;
        }

        //find another spot for the hospital
        for (var i = 0; i < numHospital; i++){
            placeRoom(0x15, [roomDefined, notStartingRoom, roomNotOpensUp, roomVisitable, notBossRoom])
        }
        for (var i = 0; i < numShops; i++) {
            placeRoom(0x16, [roomDefined, notStartingRoom, roomNotOpensUp, roomVisitable, notBossRoom])
        }
        for (var i = 0; i < numSpa; i++) {
            placeRoom(0x28, [roomDefined, notStartingRoom, roomNotOpensUp, roomNotOpensDown, roomVisitable, notBossRoom])
        }

        //Lock Boss Room
        maze[bossx][bossy].openings = NONE;

        let size = getMazeSize();

        if (size >= minimumSize && size <= maximumSize) {         
            // printAllRooms()   
            return maze;
        } else {
            // console.log("Maze (size " + size + ") too small or too big...")
        }


    }

}

function notBossRoom(room) {
    return room.enemyId != 0xF0;
}

function roomDefined(room) {
    return room !== undefined
}

function roomNotOpensUp(room) {
    return (room.openings & UP) == 0
}

function roomNotOpensDown(room) {
    return (room.openings & DOWN) == 0
}

function notStartingRoom(room) {
    return room !== undefined && room.roomId != 0x01;
}

function roomVisitable(room) {
    var roomVisitable = false;
    room.distanceFromStart.forEach((x) => {
        if (x != -1 && x != 999) {
            roomVisitable = true;                    
        }
    })
    
    return roomVisitable;
}

function placeRoom(roomId, conditions) {

    let xPosistions = shuffle([...Array(maze.length).keys()]);
    
    var roomPlaced = false;
    xPosistions.forEach((x) => {
        let yPosistions = shuffle([...Array(maze[0].length).keys()]);
        if (roomPlaced) {
            return;
        }

        yPosistions.forEach((y) => {

            if(roomPlaced) {
                return;
            }

            var room = maze[x][y];
            var meetsConditions = true;
            conditions.forEach((condition) => {
                if (meetsConditions && !condition(room)) {                    
                    meetsConditions = false;
                }
            })

            if (meetsConditions) {
                room.roomId = roomId
                roomPlaced = true;
            }
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

function checkPathFromStart(roomList) {
    let startRoom = maze[3][3];
    DIRECTIONS.forEach((dir) => {
        
        if (startRoom.openings & dir) {
            startRoom.distanceFromStart[DIR_INDEX[dir]] = 0;
            
            traverseMaze(3 + xOffSet[dir], 3 + yOffSet[dir], 0, dir, roomList)
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


function traverseMaze(x, y, distance, directionFrom, roomList) {

    let room = maze[x][y];    
    let roomLayout = roomList[room.roomId]
    let roomExitDir = oppositeDir[directionFrom];
    room.distanceFromStart[DIR_INDEX[roomExitDir]] = distance

    //anything that connects to direction is distance + 1 and should be recursed
    //anything that isn't open is -1
    let allDirs = [UP, DOWN, LEFT, RIGHT];
    allDirs.forEach((dir) => {
        if (room.distanceFromStart[DIR_INDEX[dir]] <= distance + 1) {
            return;
        }

        if (room.openings & dir){
            if(roomLayout.paths[DIR_INDEX[roomExitDir]] & dir){ 
                room.distanceFromStart[DIR_INDEX[dir]] = distance + 1;
                traverseMaze(x + xOffSet[dir], y + yOffSet[dir], distance + 1, dir, roomList);
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
                // console.log("No route to boss from [" + x + "][" + y + "]: " + JSON.stringify(room)) 
                printMaze(maze)               
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

function getDistanceFromBossRoom(x, y, exit, distance, roomList) {
    // console.log("checking [" + x + "][" + y + "] for distance " + distance + " to exit " + exit)
    let room = maze[x][y];
   
    DIRECTIONS.forEach((dir) => {
        if (room.openings & dir) {
            if (room.distanceFromBoss[DIR_INDEX[dir]] > distance + 1) {
                layout = roomList[room.roomId];
                if(layout.paths[DIR_INDEX[dir]] & exit) {
                    room.distanceFromBoss[DIR_INDEX[dir]] = distance + 1;
                    getDistanceFromBossRoom(x + xOffSet[dir], y + yOffSet[dir], oppositeDir[dir], distance + 1, roomList);       
                }
            }

        } else {
            room.distanceFromBoss[DIR_INDEX[dir]] = -1
        }
    })

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
                if ([1,2,8].indexOf(roomToCheck.openings) > -1) {
                    roomToCheck.roomId = bossRoomId;
                    roomToCheck.enemyId = 0xF0;
                    // console.log("Placing boss in " + xCheck + "," + yCheck + ": " + JSON.stringify(roomToCheck))
                    return true;
                }
                
            }
        }
        yCheck = yStart
    }

    //super unlikely but could happen
    // console.log("No boss room placable")
    return false;
}


function propogate(startx, starty, wallChance, roomList) {
    // console.log("Propogating to " + startx + ", " + starty + " with " + roomList.length + " rooms")
    //look and see if the surrounding ones are already populated
    //for any not populated determine if we want 
    var currentRoom = maze[startx][starty];
    if (currentRoom === undefined) {
        currentRoom = makeRoom();
        maze[startx][starty] = currentRoom;
    }

    if (currentRoom.visitedInGeneration) {
        return;
    }

    var roomOpenings = 0    

    leftRoomConnected = false;
    rightRoomConnected = false;
    upRoomConnected = false;
    downRoomConnected = false;
    var neededConnections = 0x0;

    if (startx > 0) {
        let leftRoom = maze[startx - 1][starty];
        if (leftRoom && (leftRoom.openings & RIGHT)) {
            neededConnections = neededConnections | LEFT;
        }
    }  

    if (startx < 7) {
        let rightRoom = maze[startx + 1][starty];
        if (rightRoom && (rightRoom.openings & LEFT)) {
            neededConnections = neededConnections | RIGHT;
        }
    }

    if (starty > 0) {
        let upRoom = maze[startx][starty - 1];
        if (upRoom && (upRoom.openings & DOWN)) {
            neededConnections = neededConnections | UP;        
        }
    }

    if (starty < 7) {
        let downRoom = maze[startx][starty + 1];
        if (downRoom && (downRoom.openings & UP)) {
            neededConnections = neededConnections | DOWN;
        }
    }

    currentRoom.roomId = Math.floor(Math.random() * 0x29)
    while (roomList[currentRoom.roomId] === undefined) {
        // console.log("No room info for room Id " + currentRoom.roomId)
        currentRoom.roomId = Math.floor(Math.random() * 0x29)
    }
    while (RESERVED_ROOMS.indexOf(currentRoom.roomId) > -1 ||  (roomList[currentRoom.roomId].validEntrances & neededConnections) != neededConnections) {
        currentRoom.roomId = Math.floor(Math.random() * 0x29)
    }

    let roomLayout = roomList[currentRoom.roomId]

    DIRECTIONS.forEach((dir) => {
        //ensure there's a valid room that direction
        let adjacentX = startx + xOffSet[dir]
        let adjacentY = starty + yOffSet[dir]
        if (adjacentX > -1 && adjacentX < 8 && adjacentY > -1 && adjacentY < 8 && (roomLayout.validEntrances & dir)) {
            adjacentRoom = maze[adjacentX][adjacentY]
            if (adjacentRoom != undefined && adjacentRoom.visitedInGeneration) {
                if (adjacentRoom.openings & oppositeDir[dir]) {
                    roomOpenings = roomOpenings | dir;
                }
            } else {
                let chance = (Math.random() * 100)
                if (chance > wallChance) {
                    roomOpenings = roomOpenings | dir;
                }
            }
        }
    })
   
    currentRoom.openings = roomOpenings;    
    currentRoom.visitedInGeneration = true;

    DIRECTIONS.forEach((dir) => {
        if (roomOpenings & dir) {
            propogate(startx + xOffSet[dir], starty + yOffSet[dir], wallChance, roomList)
        }
    })
}

/**
 * Creates a default room
 */
function makeRoom() {
    var room = {
        //Which doors are open
        openings: 0xf,        

        //Which Room
        roomId: 0x0D,

        //Whether or not we've visited this room while generating the maze, doesn't really belong here but it's convienent
        visitedInGeneration: false,

        //Distance from boss for each entrance, invalid will be -1 and unchecked entrences will be 999
        distanceFromBoss: [999,999,999,999],
        
        //Distance from start for each entrance, invalid will be -1 and unchecked entrences will be 999, at least 1 must be > -1 for the room to be reachable
        distanceFromStart: [999,999,999,999],
        
        //Which Enemy is in the room.  0 is no enemy, 0xf is always the boss
        enemyId: 0x0,
    }

    return room;
}

// function printMaze(maze) {
//     for(var y = 0; y < 8 ; y++) {
//         line = ""
//         for(var x = 0; x < 8; x++) {
//             room = maze[x][y]
//             if (room === undefined) {
//                 line += "(00, 0, 0) "
//             } else {
//                 line += "(" + room.roomId.toString(16).padStart(2, "0") + ", " + room.openings.toString(16) + ", " + minPositive(room.distanceFromBoss) + ") ";
//             }
//         }
//         console.log(line)
//     }
// }

function minPositive(arr) {
    var min = 9;
    for (var x = 0; x < arr.length; x++) {
        if (arr[x] > 0 && arr[x] < min) {
            min = arr[x];
        }
    }

    return min;
}

function printMaze(maze) {
    var htmlSpoiler = '<html><head><link rel="stylesheet" type="text/css" href="../stylesheets/dungeon.css" /></head><body>'
    htmlSpoiler += '<div class="maze">'

    var line = ""
    for (var y = 0; y < 8; y++) {
        for (var x = 0; x < 8; x++){    
            room = maze[x][y]
            var imgName = "00.png";
            var openings = 0x0;
            if (room !== undefined){
                imgName = room.roomId.toString(16).padStart(2, "0") + ".png"      
                openings = room.openings;  
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
            
            // var enemy = mazeBytes[Math.floor(index/2) + 128];
            // if (enemy != 0x00 && ((enemy & 0xf0) != 0x50)) {
                // line += '<img class="opening-img" src="../images/enemies/' + enemy.toString(16) + '.png" />';
            // }
            line += '<img class="roomImage" src="../images/fortresses/' + imgName + '"/></div>'

        }
    }
    htmlSpoiler += line;
    htmlSpoiler += "<div></body></html>";
    // console.log(htmlSpoiler)
    return htmlSpoiler;

}

module.exports = {kiDungeonGen};