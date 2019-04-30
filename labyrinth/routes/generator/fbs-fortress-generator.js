

const dungeonLevelOffsets = [0, 0x1b1b8, 0x1b4ac, 0x1b780]
const centurionOffsets = [0, 0x1b2c4, 0x1b5b8, 0x1bb88c]
const ROOM_NORMAL = 1;
const ROOM_START = 2;
const ROOM_BOSS = 3;
const ROOM_NURSE = 5;
const ROOM_SPA = 6;
const ROOM_SHOP = 7;

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

roomenemy1 = [];
roomenemy2 = [];
roomenemy1[0x01] = 0x00;
roomenemy2[0x01] = 0x00;
roomenemy1[0x02] = 0x61;
roomenemy2[0x02] = 0x61;
roomenemy1[0x03] = 0x37;
roomenemy2[0x03] = 0x10;
roomenemy1[0x04] = 0x38;
roomenemy2[0x04] = 0x10;
roomenemy1[0x07] = 0x51;
roomenemy2[0x07] = 0x51;
roomenemy1[0x08] = 0x52;
roomenemy2[0x08] = 0x52;
roomenemy1[0x0A] = 0x35;
roomenemy2[0x0A] = 0x10;
roomenemy1[0x0B] = 0x0F;
roomenemy2[0x0B] = 0x0F;
roomenemy1[0x0C] = 0x36;
roomenemy2[0x0C] = 0x10;
roomenemy1[0x0E] = 0x31;
roomenemy2[0x0E] = 0x41;
roomenemy1[0x0F] = 0x10;
roomenemy2[0x0F] = 0x10;
roomenemy1[0x12] = 0x30;
roomenemy2[0x02] = 0x40;
roomenemy1[0x13] = 0x50;
roomenemy2[0x03] = 0x50;
roomenemy1[0x14] = 0x38;
roomenemy2[0x04] = 0x10;
roomenemy1[0x15] = 0x00;
roomenemy2[0x05] = 0x00;
roomenemy1[0x16] = 0x00;
roomenemy2[0x06] = 0x00;
roomenemy1[0x19] = 0x41;
roomenemy2[0x09] = 0x10;
roomenemy1[0x1B] = 0x36;
roomenemy2[0x0B] = 0x46;
roomenemy1[0x1C] = 0x52;
roomenemy2[0x0C] = 0x52;
roomenemy1[0x1E] = 0x00;
roomenemy2[0x0E] = 0x10;
roomenemy1[0x20] = 0x50;
roomenemy2[0x00] = 0x50;
roomenemy1[0x21] = 0x00;
roomenemy2[0x01] = 0x10;
roomenemy1[0x26] = 0x31;
roomenemy2[0x06] = 0x41;
roomenemy1[0x28] = 0x00;
roomenemy2[0x08] = 0x00;
roomenemy1[0x29] = 0x0F;
roomenemy2[0x09] = 0x0F;

const spikes = [0x07, 0x08, 0x13, 0x1c, 0x20]
const spikeInfo = []
spikeInfo[0x07] = [0, 0x51, 0, 0]
spikeInfo[0x08] = [0, 0x52, 0, 0x52]
spikeInfo[0x13] = [0, 0x50, 0x51, 0x53]
spikeInfo[0x1c] = [0, 0, 0x52, 0x51]
spikeInfo[0x20] = [0, 0, 0x53, 0x50]

function generatePatchForFortress(world, difficulty) {
    
    let map = generateFortress(world, difficulty);

    let roomData = []
    let enemyData = []
    let centurionData = [0x1a, 0x00, 0xff]

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
                        if (roomOpenings != undefined && (roomOpenings & openings == openings) && randRoom != previousRoom){
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
                        let rooms = [0x01, 0x03, 0x29, 0x16]
                        roomId = rooms[i];
                    }
                }
            }
            //Push the roomId and the openings
            roomData.push(roomId);
            roomData.push(openings);

            //determine enemies for rooms
            var enemy = 0x0;
            let enemyChance = Math.floor(Math.random()* 100) + 1;
            if (difficulty == 1) {
                //easy 20/80/0
                if(enemyChance > 20) {
                    enemy =  roomenemy1[roomId]                   
                }
            } else if(difficulty == 2) {
                if (enemyChance >= 10 && enemyChance <= 90) {enemy = roomenemy1[roomId]}
                else if(enemyChance > 90) {enemy =  roomenemy2[roomId]}
            } else if(difficulty == 3) {
                if (enemyChance <= 80) {enemy =  roomenemy1[roomId]}
                else if(enemyChance > 80) {enemy =  roomenemy2[roomId]}  
            }

            if(spikes.indexOf(roomId) > -1) {
                enemyId = spikeInfo[roomId][world];
            }

            if(map[x][y] == ROOM_BOSS) {
                enemyId = 0xf0
            }

            enemyData.push(enemy);            
        }
    }

    return [{
        data: roomData.concat(enemyData),
        offset: dungeonLevelOffsets[world]
    },{
        data: centurionData,
        offset: centurionOffsets[world]
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
            for (x = 0; x < j-1; x++) {
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
        if(world == 3 && map[7,7] == 0 || map[7,7] == 3){
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

