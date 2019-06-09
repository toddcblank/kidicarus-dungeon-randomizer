const ROOM_NORMAL = 1;
const ROOM_START = 2;
const ROOM_BOSS = 3;
const ROOM_NURSE = 5;
const ROOM_SPA = 6;
const ROOM_SHOP = 7;

function generatePatchForFortress(world, difficulty, rooms) {

    let map = generateMap(world, difficulty, rooms);

    //This is what we'll return for population.
    let mapRooms = [];
    for (var i = 0; i < 8; i++) {
        mapRooms[i] = [];
    }

    for (var y = 0; y < 8; y++) {
        for (var x = 0; x < 8; x++) {
            var openings = 0x0;
            var roomId = 0x0;
            var previousRoom = 0x0;

            let room = {
                //Which doors are open
                openings: 0x0,        
        
                //Which Room
                roomId: 0x0,        
                
                //Which Enemy is in the room.  0 is no enemy, 0xf is always the boss
                enemyId: 0x0,
            }

            if (y > 0 && map[x][y-1]) {openings += 1}
            if (x < 7 && map[x+1][y]) {openings += 2}
            if (y < 7 && map[x][y+1]) {openings += 4}
            if (x > 0 && map[x-1][y]) {openings += 8}

            if (map[x][y] == ROOM_BOSS) {
                openings = 0x0;
            }

            switch(map[x][y]) {
                case 0:
                case 4:
                case 8:
                    //no room
                    roomId = 0x0;
                    openings = 0x0;
                    break;
                case ROOM_NORMAL:
                    while(roomId == 0x0){
                        let randRoom = Math.floor(Math.random() * 41) + 1;
                        let roomOpenings = rooms[randRoom].twoWayPaths
                        if (roomOpenings != undefined && ((roomOpenings & openings) == openings) && randRoom != previousRoom){
                            previousRoom = randRoom;
                            roomId = randRoom
                        }                        
                    }
                    break;
                case ROOM_START:
                    roomId = 0x01;
                    break;
                case ROOM_BOSS:
                    if (world == 2) {
                        roomId = 0x0b;
                    } else {
                        roomId = 0x29;
                    }
                    break;
                case ROOM_NURSE:
                    roomId = 0x15;
                    break;
                case ROOM_SPA:
                    roomId = 0x28;
                    break;
                case ROOM_SHOP:
                    roomId = 0x16;
                    break;
            }

            if (world == 3 && x == 7 && y == 7 && map[x][y] != 0) {
                if (Math.random()  < .33 ) {
                    //only do this if there is no opening above
                    if(openings & 1 == 0) {
                        let i = Math.floor(Math.random() * 4);
                        let clippableRooms = [0x01, 0x03, 0x29, 0x16]
                        roomId = clippableRooms[i];
                    }
                }
            }

            var enemy = 0x0;
            //Mark the boss room
            if(map[x][y] == ROOM_BOSS) {
                enemy = 0xf0
            }     
            
            room.roomId = roomId;
            room.openings = openings;            
            room.enemyId = enemy;

            mapRooms[x][y] = room;
        }
    }
        
    return mapRooms;
}

function generateMap(world, difficulty) {
    let map = [];

    while(map.length == 0){
        //Step 0 - create empty map
        for(var i = 0; i < 8; i++) {
            map[i] = []
            for (j = 0; j < 8; j++) {
                map[i][j] = 0;
            }
        }

        //step 1: random line segments
        for (i = 0; i < 15 + world * 2; i++) {
            var x;
            var y;
            if (i == 0) {
                x = 3;
                y = 3;
            } else {
                x = Math.floor(Math.random() * 8)            
                y = Math.floor(Math.random() * 8)
            }

            let linesize = Math.floor(Math.random() * 4) + 2; //Length 2 - 5
            let direction = Math.floor(Math.random() * 4) + 1 //Direction
            for(var j = 0; j < linesize; j++) {
                map[x][y] = 1;
                switch(direction) {
                    case 1:
                        x += 1;
                        break;
                    case 2:
                        x -= 1;
                        break;
                    case 3: 
                        y += 1;
                        break;
                    case 4:
                        y -= 1;
                        break;
                }

                if (x < 0 || y < 0 || x > 7 || y > 7) {
                    break;
                }
            }
        }

        // console.log("----- Initial Map ----")
        // printMap(map)

        //step 1.5 if this is 3.4 add a room in lower right
        if (world == 3) {
            map[7][7] = 1;
        }

        // console.log("----- Adding lower right room ----")
        // printMap(map)
        
        //step 2 - holes in dense 3x3 areas
        for (var x = 1; x < 7; x++) {
            for (var y = 1; y < 7; y++) {
                var sum =       map[x-1][y-1] + map[x-1][y] + map[x-1][y+1];
                sum     = sum + map[x][y-1]   + map[x][y]   + map[x][y+1];
                sum     = sum + map[x+1][y-1] + map[x+1][y] + map[x+1][y+1];

                if (sum > 7) {
                    map[x][y] = 0;
                }
            }
        }

        // console.log("---- poked holes in 3x3 -----")
        // printMap(map)
        
        //step 3 - holes in dense 2x2 areas
        for (var x = 0; x < 7; x++) {
            for (var y = 0; y < 7; y++) {
                var sum =       map[x+1][y+1] + map[x+1][y]
                sum     = sum + map[x][y+1]   + map[x][y] 

                if (sum > 3) {
                    switch(Math.floor(Math.random() * 4)) {
                    case 0:
                        map[x][y] = 0;
                        break;
                    case 1:
                        map[x+1][y] = 0;
                        break;
                    case 2: 
                        map[x][y+1] = 0;
                        break;
                    case 3:
                        if (x < 7 || y < 7 || world != 3) {
                            map[x+1][y+1] = 0
                        } else {
                            map[x+1][y] = 0
                        }
                    }                        
                }
            }
        }

        // console.log("---- poking holes in 2x2 -----")
        // printMap(map)

        //step 4 - remove unconnected rooms
        map[3][3] = 1;
        map[2][3] = 0;
        floodfill(map, 3, 3, 1, 4);
        // console.log("----- Flood Filling ----")
        // printMap(map)
        for (var x = 0; x < 8; x++) {
            for (var y = 0; y < 8; y++){
                if (map[x][y] != 4) {map[x][y] = 0}
            }
        }
        //set visitable rooms to 4.
        for (var x = 0; x < 8; x++) {
            for (var y = 0; y < 8; y++){
                if (map[x][y] == 4) {map[x][y] = 1}
            }
        }

        // console.log("---- Visitable only -----")
        // printMap(map)

        //step 5 - trim downward dead ends
        for (y = 7; y >=0; y--) {
            let j = 8;
            for (x = 0; x < j; x++) {
                if (x == 3 && y == 3) {
                    continue;
                }

                if (map[x][y] == 1 && (x == 0 || map[x-1][y] != 1) && (x == 7 || map[x+1][y] != 1) && (y == 7 || map[x][y+1] != 1)) {
                    map[x][y] = 0;
                }
            }
        }

        // console.log("---- Trimmed downward ends -----")
        // printMap(map)

        //step 6 - compute distance from each room to start
        let roomDistance = []
        for (var x = 0; x < 8; x++) {
            roomDistance[x] = []
            for (var y = 0; y < 8; y++) {
                roomDistance[x][y] = 65
            }
        }

        roomDistance[3][3] = 1;
        spreadDistance(roomDistance, map, 3, 3)

        //step 7 - furthest room
        var farthestDistance = 0;
        var farthestX = 3;
        var farthestY = 3;
        for (var x = 0; x < 8; x++) {
            for (var y = 0; y < 8; y++) {
                if (roomDistance[x][y] > farthestDistance && roomDistance[x][y] != 65) {
                    farthestDistance = roomDistance[x][y];
                    farthestX = x;
                    farthestY = y;
                }
            }
        }

        //step 8 - start & end
        map[3][3] = 2; // start
        map[2][3] = 0; //no room to the left
        map[farthestX][farthestY] = 3 //boss

        //Step 9, find dead end with no room above for refill
        var numHotsprings = 4 - difficulty
        if (world == 1 && numHotsprings == 3) {
            numHotsprings = 2;
        }
        
        var roomIndices = [...Array(64).keys()]
        for (var i = 0; i < numHotsprings; i++) {
            var shuffledIndices = shuffle(roomIndices);

            //Iterate through the rooms randomly
            for(var index = 0; index < shuffledIndices.length; index++) {
                let x = shuffledIndices[index] % 8;
                let y = (shuffledIndices[index] - x) / 8

                //check if room is a dead end, with nothing on top or below
                if (map[x][y] == 1 //this tile is in the map, and not another room already
                    && (y == 0 || map[x][y-1] == 0) //nothing above
                    && (y == 7 || map[x][y+1] == 0) //nothing below
                    && (x == 0 || x == 7 || map[x-1][y] == 0 || map[x+1][y] == 0)) { //only one side
                    map[x][y] = 6;
                    break;
                }
            }
        }

        //Step 10 place nurse and shop
        var numPlacements = 1;
        if (difficulty == 1 && world != 1) {
            numPlacements = 2;
        }

        for (var i = 0; i < numPlacements; i++) {
            var shuffledIndices = shuffle(roomIndices);
            for (var index = 0; index < shuffledIndices.length; index++){
                let x = shuffledIndices[index] % 8;
                let y = (shuffledIndices[index] - x) / 8

                if (map[x][y] == 1 && (y == 0 || map[x][y-1] == 0)) {
                    //Not next to another nurse
                    if ((x == 0 || map[x-1][y] != 5) && (x == 7 || map[x+1][y] != 5)){
                        map[x][y] = 5;
                        break;
                    }
                }
            }

            shuffledIndices = shuffle(roomIndices);for (var index = 0; index < shuffledIndices.length; index++){
                let x = shuffledIndices[index] % 8;
                let y = (shuffledIndices[index] - x) / 8
                if (map[x][y] == 1 && (y == 0 || map[x][y-1] == 0)) {
                    //Not next to another nurse
                    if ((x == 0 || map[x-1][y] != 7) && (x == 7 || map[x+1][y] != 7)){
                        map[x][y] = 7;
                        break;
                    }
                }
            }
        }

        // console.log("---- Rooms Placed -----")
        // printMap(map)

        var roomcount = 0;

        map.forEach((row) => {row.forEach((cell) => {
            if (cell > 0){roomcount++}
        })})

        var fortress = 0;
        if (farthestDistance >= 11 && farthestDistance <= 17){
            fortress = 1;
        } else if (farthestDistance >= 18 && farthestDistance <= 24){
            fortress = 2;
        } else if (farthestDistance >= 25) {
            fortress = 3
        } 

        if (roomcount <= farthestDistance & 1.35) {
            fortress = -1;
            // console.log("Roomcount too linear")
        }

        if (fortress > 0 && fortress < 3 && roomcount >= farthestDistance*3) {
            fortress += 1;
        }

        //Last minute checks
        if((farthestX == 0 || map[farthestX-1][farthestY] == 0) &&  (farthestY == 0 || map[farthestX][farthestY-1] == 0)) {
            fortress = 0
            // console.log("Boss room not enterable from top or right")
        }

        //make sure there is no room to the right or below of the boss
        if(farthestX != 7 && map[farthestX + 1][farthestY] != 0) {
            fortress = 0
            // console.log("Room to right or boss!")
        }

        if(farthestY != 7 && map[farthestX][farthestY + 1] != 0) {
            fortress = 0
            // console.log("Room to bottom of boss!")
        }

        //make sure theres only an entrance to left or right, and not both
        var count = 0;
        if(farthestX == 0 || map[farthestX - 1][farthestY] > 0) count += 1
        if(farthestY == 0 || map[farthestX][farthestY - 1] > 0) count += 1
        if(count != 1){
            fortress = 0;
            // ("Two entrances to boss!")
        }

        //if 3-4, make sure there is a room in lower right that isn't boss
        if(world == 3 && map[7][7] == 0 || map[7][7] == 3){
            fortress = 0
            // console.log("No Room in lower right!")
        }
        // console.log("generated fortress: " + fortress)
        // printMap(map)
        // console.log("-----------------------")
        if (fortress != world) {
            map = []
        }
    }

    return map;

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

function spreadDistance(roomDistance, map, x, y) {
    let thisRoomsDistance = roomDistance[x][y];

    if (x > 0 && map[x-1][y] != 0 && roomDistance[x-1][y] > (thisRoomsDistance + 1)) {
        roomDistance[x-1][y] = thisRoomsDistance + 1;
        spreadDistance(roomDistance, map, x-1, y);
    }

    if (x < 7 && map[x+1][y] != 0 && roomDistance[x+1][y] > (thisRoomsDistance + 1)) {
        roomDistance[x+1][y] = thisRoomsDistance + 1;
        spreadDistance(roomDistance, map, x+1, y);
    }

    if (y > 0 && map[x][y-1] != 0 && roomDistance[x][y-1] > (thisRoomsDistance + 1)) {
        roomDistance[x][y-1] = thisRoomsDistance + 1;
        spreadDistance(roomDistance, map, x, y-1);
    }

    if (y < 7 && map[x][y+1] != 0 && roomDistance[x][y+1] > (thisRoomsDistance + 1)) {
        roomDistance[x][y+1] = thisRoomsDistance + 1;
        spreadDistance(roomDistance, map, x, y+1);
    }
}

function floodfill(map, x, y, openroomIndicator, visitedIndicator) {
    if (map[x][y] != openroomIndicator) {
        return;
    }
    map[x][y] = visitedIndicator;
    if (y < 7) {floodfill(map, x, y+1, openroomIndicator, visitedIndicator)}
    if (y > 0) {floodfill(map, x, y-1, openroomIndicator, visitedIndicator)}
    if (x < 7) {floodfill(map, x+1, y, openroomIndicator, visitedIndicator)}
    if (x > 0) {floodfill(map, x-1, y, openroomIndicator, visitedIndicator)}
}

module.exports = {generatePatchForFortress}

