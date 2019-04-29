function generateFortress(world) {
    let map = [];
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
        if (i = 0) {
            //initial room
            x = 4;
            y = 4;
        } else {
            x = Math.floor(Math.random() * 8) + 1            
            y = Math.floor(Math.random() * 8) + 1
        }

        let linesize = Math.floor(Math.random() * 4) + 2; //Length 2 - 5
        let direction = Math.floor(Math.random() * 4) + 1 //Direction
        for(var j = 0; j < linesize; j++) {
            map[i][j] = 1;
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

    //step 1.5 if this is 3.4 add a room in lower right
    if (world == 3) {
        map[7][7] = 1;
    }

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

    //step 3 - holes in dense 2x2 areas
    for (var x = 0; x < 7; x++) {
        for (var y = 0; y < 7; y++) {
            var sum =       map[x-1][y-1] + map[x-1][y]
            sum     = sum + map[x][y-1]   + map[x][y] 

            if (sum > 3) {
                switch(Math.floor(Math.random() * 4)) {
                case 0:
                    map(x,y) = 0;
                    break;
                case 1:
                    map(x+1, y) = 0;
                    break;
                case 2: 
                    map(x, y+1) = 0;
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

    //step 4 - remove unconnected rooms
    map[3][3] = 1;
    map[2][3] = 0;
    floodfill(map, 3, 3, 1, 4);
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

    //step 5 - trim downward dead ends
    for (y = 7; y >=0; y--) {
        let j = 8;
        for (x = 0; x < j; x++) {
            if (x == 3 && y == 3) {
                continue;
            }

            if (map[x][y] == 1 && map[x-1][y] != 1 && map[x+1][y] != 1 && map[x][y+1] != 1) {
                map[x][y] = 0;
            }
        }
    }

    //step 6 - compute distance from each room to start
    let roomDistance = []
    for (var x = 0; x < 8; x++) {
        roomDistance[x] = []
        for (var y = 0; y < 8; y++) {
            roomDistance[x][y] = 65
        }
    }

    var x = 3;
    var y = 3;
    roomDistance[x][y] = 1;
    if(map[x-1][y] == 1) {roomDistance[x-1][y] = 2} 
    if(map[x+1][y] == 1) {roomDistance[x+1][y] = 2} 
    if(map[x][y-1] == 1) {roomDistance[x][y-1] = 2} 
    if(map[x][y+1] == 1) {roomDistance[x][y+1] = 2} 


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
    if (x < 0) {floodfill(map, x-1, y, openroomIndicator, visitedIndicator)}
}
