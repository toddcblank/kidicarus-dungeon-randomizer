let dr = require('./dungeon-rooms')

const dungeonLevelOffsets = [0, 0x1b1b8, 0x1b4ac, 0x1b780]
const centurionOffsets = [0, 0x1b2c4, 0x1b5b8, 0x1b88c]
const bossMusicOffsets = [0, 0x1cba0, 0x1cba1, 0x1cba2]
const ROOM_NORMAL = 1;
const ROOM_START = 2;
const ROOM_BOSS = 3;
const ROOM_NURSE = 5;
const ROOM_SPA = 6;
const ROOM_SHOP = 7;

//Number of rooms that will have centurions.  In the vanilla game,
//1-4 has 28, 2-4 has 32, and 3-4 has 19.
//I chose lower numbers here because our dungeons have fewer
//screens compared to the vanilla game (especially in 1-4).
const centurionAmount = [0, 10, 15, 19]

const centurionValidLocation = []
centurionValidLocation[0x01]=0x7B
centurionValidLocation[0x02]=0xAD
centurionValidLocation[0x03]=0xA4
centurionValidLocation[0x04]=0xA1
centurionValidLocation[0x07]=0xAD
centurionValidLocation[0x08]=0xA1
centurionValidLocation[0x0A]=0xAD
centurionValidLocation[0x0B]=0x76
centurionValidLocation[0x0C]=0x75
centurionValidLocation[0x0E]=0x83
centurionValidLocation[0x0F]=0x44
centurionValidLocation[0x12]=0x79
centurionValidLocation[0x13]=0x84
centurionValidLocation[0x14]=0x8C
centurionValidLocation[0x15]=0xAE
centurionValidLocation[0x16]=0x8D
centurionValidLocation[0x19]=0xAA
centurionValidLocation[0x1B]=0xAC
centurionValidLocation[0x1C]=0x3A
centurionValidLocation[0x1E]=0xA4
centurionValidLocation[0x20]=0x85
centurionValidLocation[0x21]=0x49
centurionValidLocation[0x26]=0x86
centurionValidLocation[0x28]=0x7C
centurionValidLocation[0x29]=0x55

const roomokay = []
roomokay[0x01]=0b0000
roomokay[0x02]=0b1110
roomokay[0x03]=0b1111
roomokay[0x04]=0b1111
roomokay[0x07]=0b1110
roomokay[0x08]=0b0110
roomokay[0x0A]=0b1011
roomokay[0x0B]=0b0000
roomokay[0x0C]=0b1111
roomokay[0x0E]=0b1100
roomokay[0x0F]=0b1111
roomokay[0x12]=0b1010
roomokay[0x13]=0b1110
roomokay[0x14]=0b1011
roomokay[0x15]=0b0000
roomokay[0x16]=0b0000
roomokay[0x19]=0b1111
roomokay[0x1B]=0b1000
roomokay[0x1C]=0b0101
roomokay[0x1E]=0b1000
roomokay[0x20]=0b1111
roomokay[0x21]=0b0111
roomokay[0x26]=0b0110
roomokay[0x28]=0b0000
roomokay[0x29]=0b0000

let roomenemy1 = [];
let roomenemy2 = [];
roomenemy1[0x00] = 0x00;roomenemy2[0x00] = 0x00;
roomenemy1[0x01] = 0x00;roomenemy2[0x01] = 0x00;
roomenemy1[0x02] = 0x61;roomenemy2[0x02] = 0x61;
roomenemy1[0x03] = 0x37;roomenemy2[0x03] = 0x10;
roomenemy1[0x04] = 0x38;roomenemy2[0x04] = 0x10;
roomenemy1[0x07] = 0x51;roomenemy2[0x07] = 0x51;
roomenemy1[0x08] = 0x52;roomenemy2[0x08] = 0x52;
roomenemy1[0x0A] = 0x35;roomenemy2[0x0A] = 0x10;
roomenemy1[0x0B] = 0x0F;roomenemy2[0x0B] = 0x0F;
roomenemy1[0x0C] = 0x36;roomenemy2[0x0C] = 0x10;
roomenemy1[0x0E] = 0x31;roomenemy2[0x0E] = 0x41;
roomenemy1[0x0F] = 0x10;roomenemy2[0x0F] = 0x10;
roomenemy1[0x12] = 0x30;roomenemy2[0x12] = 0x40;
roomenemy1[0x13] = 0x50;roomenemy2[0x13] = 0x50;
roomenemy1[0x14] = 0x38;roomenemy2[0x14] = 0x10;
roomenemy1[0x15] = 0x00;roomenemy2[0x15] = 0x00;
roomenemy1[0x16] = 0x00;roomenemy2[0x16] = 0x00;
roomenemy1[0x19] = 0x41;roomenemy2[0x19] = 0x10;
roomenemy1[0x1B] = 0x36;roomenemy2[0x1B] = 0x46;
roomenemy1[0x1C] = 0x52;roomenemy2[0x1C] = 0x52;
roomenemy1[0x1E] = 0x00;roomenemy2[0x1E] = 0x10;
roomenemy1[0x20] = 0x50;roomenemy2[0x20] = 0x50;
roomenemy1[0x21] = 0x00;roomenemy2[0x21] = 0x10;
roomenemy1[0x26] = 0x31;roomenemy2[0x26] = 0x41;
roomenemy1[0x28] = 0x00;roomenemy2[0x28] = 0x00;
roomenemy1[0x29] = 0x0F;roomenemy2[0x29] = 0x0F;

const spikes = [0x07, 0x13, 0x1c, 0x20]
const spikeInfo = []
spikeInfo[0x07] = [0, 0x51, 0x51, 0x51]
// spikeInfo[0x08] = [0, 0x52, 0x52, 0x52]
spikeInfo[0x13] = [0, 0x50, 0x50, 0x50]
spikeInfo[0x1c] = [0, 0x53, 0x53, 0x53]
spikeInfo[0x20] = [0, 0x52, 0x52, 0x52]
//I've standardized spikes so every spike room will have spikes.  this one
//seemed to be least interesting, so it won't appear anymore.
//instead it'll have enemies
//spikeInfo[0x20] = [0, 0, 0, 0x50]

function generatePatchForFortress(world, difficulty, newrooms = []) {
    
    if (newrooms) {
        for (var i = 0; i < newrooms.length; i++) {
            roomokay[newrooms[i].roomIdNum] = newrooms[i].roomokay
        }
    }

    let map = generateFortress(world, difficulty);

    let roomData = []
    let enemyData = []
    var bossRoomIndex = 0;

    for (var y = 0; y < 8; y++) {
        for (var x = 0; x < 8; x++) {
            var openings = 0x0;
            var roomId = 0x0;
            var previousRoom = 0x0;
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
                        let roomOpenings = roomokay[randRoom]
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
                    bossRoomIndex = x + (y * 8)
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
                        let rooms = [0x01, 0x03, 0x29, 0x16]
                        roomId = rooms[i];
                    }
                }
            }
            //Push the roomId and the openings
            roomData.push(roomId);
            roomData.push(openings);
            
            //fill enemies with "empty to start"
            var enemy = 0x0;           

            //unless there's spikes
            if(spikes.indexOf(roomId) > -1) {
                enemy = spikeInfo[roomId][world];
            }

            //or it's the boss
            if(map[x][y] == ROOM_BOSS) {
                enemy = 0xf0
            }

            enemyData.push(enemy);            
        }
    }
    
    //Place centurions
    let centurionData = [0x1a, 0x00] //start out with just this (map)
    let numCenturions = 0;
    while (numCenturions < centurionAmount[world]) {
        //get random room
        let randomX = Math.floor(Math.random()*8);
        let randomY = Math.floor(Math.random()*8);        
        let roomIndex = randomY*8+randomX;        
        //check to see if it is a valid room
        let room = map[randomX][randomY];
        if (room == 0) {
        } else {            
            roomId = roomData[roomIndex*2]            
            if (!(centurionValidLocation[roomId] === undefined)) {
              centurionData.push(roomIndex);            
              centurionData.push(centurionValidLocation[roomId]);   
              numCenturions++;
            }                       
        }              
    }             
    centurionData.push(0xff); //End of centurion table
        
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

            let room = map[randomX][randomY];
            if (room == 0) {
                //empty room
                continue;
            }

            //check for current enemy
            if(enemyData[randomX + randomY * 8] != 0) {
                continue;
            }

            //check if it supports the enemy
            let roomId = roomData[(randomX + randomY * 8) * 2];
            let filteredRooms = rooms.filter((room) => {return room.roomId == roomId.toString(16).toUpperCase()})            
            let roomInfo = filteredRooms[0]

            var roomSupportsEnemy = false;
            var supportedEnemy = 0x0;
            roomInfo.validEnemies.forEach((enemyId) => {
                if ((enemyId & 0xf0) == nextEnemeyMask) {
                    roomSupportsEnemy = true;
                    supportedEnemy = enemyId;
                }
            })

            //Explicit check to make sure eggplanters aren't in a room with a top or bottom opening
            //they get cheap if they are
            //commenting out for now, more thought needs to go into this.
            // if (nextEnemeyMask == dr.EGGPLANT) {
            //     if ((randomY > 0 && map[randomX][randomY-1] != 0) || (randomY < 7 && map[randomX][randomY + 1] != 0)){
            //         roomSupportsEnemy = false;
            //     }
            // }

            if (roomSupportsEnemy) {
                placedEnemy = true;
                enemyData[randomX + randomY * 8] = supportedEnemy;
            }
        }        
    }

    //now fill any rooms that don't have enemies
    let enemyFiller = [].concat(dr.ENEMY_FILLS_BY_DIFF[difficulty])
    for (var roomIndex = 0; roomIndex < enemyData.length; roomIndex++) {
        let room = map[roomIndex % 8][Math.floor(roomIndex/8)]
        if (room == 0) {
            continue;
        }

        let currentEnemyData = enemyData[roomIndex];
        if (currentEnemyData != 0x0) {
            continue;
        }

        var enemyPlaced = false;
        var attempts = 0;
        while(!enemyPlaced){

            
            let roomId = roomData[roomIndex * 2];
            let filteredRooms = rooms.filter((room) => {return room.roomId == roomId.toString(16).toUpperCase()})            
            let roomInfo = filteredRooms[0]
            if (roomInfo.validEnemies.length == 0) {
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
                enemyData[roomIndex] = supportedEnemies[Math.floor(Math.random() * supportedEnemies.length)];
                enemyPlaced = true;                
            } else if(attempts == enemyFiller.length) {
                enemyData[roomIndex] = 0x0;
                enemyPlaced = true;
            }

        }


    }

    return [{
        name: "world " + world + " fortress room data", 
        data: roomData.concat(enemyData),
        offset: dungeonLevelOffsets[world]
    },{
        name: "world " + world + " fortress centurion data", 
        data: centurionData,
        offset: centurionOffsets[world]
    },{
        name: "world " + world + " boss music patch",
        data: [bossRoomIndex],
        offset: bossMusicOffsets[world]
    }]
}

function generateFortress(world, difficulty) {
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

function printMap(map) {

    for (y = 0; y < 8; y++) {
        row = ""
        for (x = 0; x < 8; x++) {
            row += map[x][y] + ' '
        }
        console.log(row)
    }
}

module.exports = {generatePatchForFortress}

