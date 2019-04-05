require('./dungeon-rooms')

const UP = 1
const DOWN = 2
const RIGHT = 4
const LEFT = 8
const wallChance = 40;

function kiDungeonGen(xsize = 8, ysize = 8 , startx = 3, starty = 3) {
    let maze = []
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

    //first room can be open everywhere but left, with at least one (1-7)
    let openings = Math.floor(Math.random() * 7 + 1);

    startingRoom.openings = openings;
    if ((openings & UP) == UP) {
        propogate(maze, startx, starty - 1)
    }
     
    if ((openings & DOWN) == DOWN) {
        propogate(maze, startx, starty + 1)
    }

    if ((openings & RIGHT) == RIGHT) {
        propogate(maze, startx + 1, starty)
    }


    //Now that we're done, find a spot for the boss, start in a random corner, and look for a dead end.

    //find another spot for the hospital

    //find another spot for 2 shops.

    

    console.log('<div class="maze">')
    for (var y = 0; y < ysize; y++) {
        
        var line = '<div class="row">'
        for (var x = 0; x < xsize; x++) {   
            room = maze[x][y]
            if (room === undefined) {
                line += '<div class="room open-0"></div>'
            } else {
                var imgName = room.roomId.toString(16) + ".png"
                if (room.roomId < 0x10) {
                    imgName = "0" + imgName;
                }
                line += '<div class="room open-' + room.openings + '"><img class="roomImage" src="' + imgName + '"/></div>'
            }
        }
        
        line +='</div>'
        
        console.log(line)
    }
    console.log("<div>")
}

function propogate(maze, startx, starty) {
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
    while (startingRoom.roomId == 10 || startingRoom.roomId == 0) {
        startingRoom.roomId = Math.floor(Math.random() * 0x29)
    }
    let room = rooms[startingRoom.roomId]

    if (starty > 0 && (room.validEntrances & UP) == UP) {
        aboveRoom = maze[startx][starty-1]
        if (aboveRoom != undefined) {
            //room's already there, lets check if it is connecting down
            if ((aboveRoom.openings & DOWN) == DOWN) {
                roomOpenings = roomOpenings | UP;
            }
        } else {
            //randomly decide if we want to connect to UP Let's connect 75% of the time
            if ((Math.random() * 100) > wallChance) {
                roomOpenings = roomOpenings | UP;
            }
        }
    }

    if (starty < maze[0].length - 1 && (room.validEntrances & DOWN) == DOWN) {
        belowRoom = maze[startx][starty+1]
        if (belowRoom != undefined) {
            //room's already there, lets check if it is connecting down
            if ((belowRoom.openings & UP) == UP) {
                roomOpenings = roomOpenings | DOWN;
            }
        } else {
            //randomly decide if we want to connect to UP Let's connect 75% of the time
            if ((Math.random() * 100) > wallChance) {
                roomOpenings = roomOpenings | DOWN;
            }
        }
    }

    if (startx > 0 && (room.validEntrances & LEFT) == LEFT) {
        leftRoom = maze[startx - 1][starty];
        if (leftRoom != undefined) {
            //room's already there, lets check if it is connecting down
            if ((leftRoom.openings & RIGHT) == RIGHT) {
                roomOpenings = roomOpenings | LEFT;
            }
        } else {
            //randomly decide if we want to connect to UP Let's connect 75% of the time            
            if ((Math.random() * 100) > wallChance) {
                roomOpenings = roomOpenings | LEFT;
            }
        }
        
    }

    if (startx < maze.length - 1 && (room.validEntrances & RIGHT) == RIGHT) {
        rightRoom = maze[startx + 1][starty];
        if (rightRoom != undefined) {
            //room's already there, lets check if it is connecting down
            if ((rightRoom.openings & LEFT) == LEFT) {
                roomOpenings = roomOpenings | RIGHT;
            }
        } else {
            //randomly decide if we want to connect to UP Let's connect 75% of the time
            if ((Math.random() * 100) > wallChance) {
                roomOpenings = roomOpenings | RIGHT;
            }
        }
    }
    
    startingRoom.openings = roomOpenings;    
    startingRoom.visitedInGeneration = true;

    if ((roomOpenings & UP) == UP) {
        propogate(maze, startx, starty - 1)
    }
     
    if ((roomOpenings & DOWN) == DOWN) {
        propogate(maze, startx, starty + 1)
    }

    if ((roomOpenings & RIGHT) == RIGHT) {
        propogate(maze, startx + 1, starty)
    }

    if ((roomOpenings & LEFT) == LEFT) {
        propogate(maze, startx - 1, starty)
    }
}

function makeRoom() {
    var room = {
        //Which doors are open
        openings: 0xf,        
        roomId: 0x0D,
        visitedInGeneration: false
    }

    return room;
}

function primsAlgorithm(xsize = 8, ysize = 8 , startx = 3, starty = 3) {
    let x = xsize;
    let y = ysize;
    var n=x*y-1;
	var horiz =[]; for (var j= 0; j<x+1; j++) horiz[j]= [],
	    verti =[]; for (var j= 0; j<x+1; j++) verti[j]= [],
	    here = [startx, starty],
	    path = [here],
	    unvisited = [];
	for (var j = 0; j<x+2; j++) {
		unvisited[j] = [];
		for (var k= 0; k<y+1; k++)
			unvisited[j].push(j>0 && j<x+1 && k>0 && (j != here[0]+1 || k != here[1]+1));
	}
	while (0<n) {
		var potential = [[here[0]+1, here[1]], [here[0],here[1]+1],
		    [here[0]-1, here[1]], [here[0],here[1]-1]];
		var neighbors = [];
		for (var j = 0; j < 4; j++)
			if (unvisited[potential[j][0]+1][potential[j][1]+1])
				neighbors.push(potential[j]);
		if (neighbors.length) {
			n = n-1;
			next= neighbors[Math.floor(Math.random()*neighbors.length)];
			unvisited[next[0]+1][next[1]+1]= false;
			if (next[0] == here[0])
				horiz[next[0]][(next[1]+here[1]-1)/2]= true;
			else 
				verti[(next[0]+here[0]-1)/2][next[1]]= true;
			path.push(here = next);
		} else 
			here = path.pop();
    }
    
	return {x: x, y: y, horiz: horiz, verti: verti};
}

function display(m) {
	var text= [];
	for (var j= 0; j<m.x*2+1; j++) {
		var line= [];
		if (0 == j%2)
			for (var k=0; k<m.y*4+1; k++)
				if (0 == k%4) 
					line[k]= '+';
				else
					if (j>0 && m.verti[j/2-1][Math.floor(k/4)])
						line[k]= ' ';
					else
						line[k]= '-';
		else
			for (var k=0; k<m.y*4+1; k++)
				if (0 == k%4)
					if (k>0 && m.horiz[(j-1)/2][k/4-1])
						line[k]= ' ';
					else
						line[k]= '|';
				else
					line[k]= ' ';
		// if (0 == j) line[1]= line[2]= line[3]= ' ';
		if (m.x*2-1 == j) line[4*m.y]= ' ';
		text.push(line.join('')+'\r\n');
	}
	return text.join('');
}

kiDungeonGen();