//roomId - id in Kid Icaraus, also cooresponds to image of room
//paths - array for paths FROM TBRL of room to TBRL of room.  i.e. [F, F, F, F] would be a 4 way room that you can go any direction
//        [(UP | RIGHT | DOWN), (UP | RIGHT | DOWN), (UP | RIGHT | DOWN), (UP | RIGHT | DOWN)] would mean all entrences can go TBR but none can go L
//clipPaths - same as paths, but for if the person can do the wall clips
//validEntrances:  TBRL hex value of where you can enter the room from.  i.e. the vertical rooms would be 1 + 2 + 0 + 0 = 3

const UP = 0x1;
const RIGHT = 0x2;
const DOWN = 0x4;
const LEFT = 0x8;
const ALL = UP | RIGHT | DOWN | LEFT;
const NONE = 0x0;
const DIRECTIONS = [UP, RIGHT, DOWN, LEFT]
const DIR_INDEX = []

DIR_INDEX[UP] = 0
DIR_INDEX[RIGHT] = 1
DIR_INDEX[DOWN] = 2
DIR_INDEX[LEFT] = 3

rooms = [
    {
        roomId: '0',
        paths:	[NONE, NONE, NONE, NONE],
        clipPaths: [NONE, NONE, NONE, NONE],
        validEntrances:	NONE,
        validEnemies: [],
    },
    {
        roomId: '1',
        paths:	[(UP | RIGHT | DOWN), (UP | RIGHT | DOWN), (UP | RIGHT | DOWN), NONE],
        clipPaths: [(UP | RIGHT | DOWN), (UP | RIGHT | DOWN), (UP | RIGHT | DOWN), NONE],
        validEntrances:	(UP | RIGHT | DOWN),
        validEnemies: [],
    },
    {
        roomId: '2',
        paths:	[(RIGHT | DOWN | LEFT), (RIGHT | DOWN | LEFT), (RIGHT | DOWN | LEFT), (RIGHT | DOWN | LEFT)],
        clipPaths: [(RIGHT | DOWN | LEFT), (RIGHT | DOWN | LEFT), (RIGHT | DOWN | LEFT), (RIGHT | DOWN | LEFT)],
        validEntrances:	ALL,
        validEnemies: [0x10, 0x20, 0x60, 0x61, 0x62],
    },
    {
        roomId: '3',
        paths:	[ALL, ALL, ALL, ALL],
        clipPaths: [ALL, ALL, ALL, ALL],
        validEntrances:	ALL,
        validEnemies: [0x10, 0x20, 0x34, 0x37, 0x44, 0x46, 0x47, 0x60, 0x61, 0x62],
    },
    {
        roomId: '4',
        paths:	[ALL, ALL, ALL, ALL],
        clipPaths: [ALL, ALL, ALL, ALL],
        validEntrances:	ALL,
        validEnemies: [0x34, 0x37, 0x44, 0x46, 0x47, 0x60, 0x61, 0x62],
    },
    {
        roomId: '5',
        paths:	[ALL, ALL, ALL, ALL],
        clipPaths: [ALL, ALL, ALL, ALL],
        validEntrances:	ALL,
        validEnemies: [0x34, 0x37, 0x44, 0x46, 0x47, 0x60, 0x61, 0x62],
    },
    {
        roomId: '6',
        paths:	[ALL, ALL, ALL, ALL],
        clipPaths: [ALL, ALL, ALL, ALL],
        validEntrances:	ALL,
        validEnemies: [0x34, 0x37, 0x44, 0x46, 0x47, 0x60, 0x61, 0x62],
    },
    {
        roomId: '7',
        paths:	[NONE, (RIGHT | DOWN | LEFT), (RIGHT | DOWN | LEFT), (RIGHT | DOWN | LEFT)],
        clipPaths: [NONE, (RIGHT | DOWN | LEFT), (RIGHT | DOWN | LEFT), (RIGHT | DOWN | LEFT)],
        validEntrances:	(RIGHT | DOWN | LEFT),
        validEnemies: [0x51],
    },
    {
        roomId: '8',
        paths:	[(RIGHT | DOWN | LEFT), (RIGHT | DOWN), (RIGHT | DOWN), (RIGHT | DOWN | LEFT)],
        clipPaths: [(RIGHT | DOWN | LEFT), (RIGHT | DOWN), (RIGHT | DOWN), (RIGHT | DOWN | LEFT)],
        validEntrances:	ALL,
        validEnemies:	[0x52],
    },
    {
        roomId: '9',
        paths:	[(RIGHT | DOWN | LEFT), (RIGHT | DOWN), (RIGHT | DOWN), (RIGHT | DOWN | LEFT)],
        clipPaths: [(RIGHT | DOWN | LEFT), (RIGHT | DOWN), (RIGHT | DOWN), (RIGHT | DOWN | LEFT)],
        validEntrances:	ALL,
        validEnemies:	[0x52],
    },    
    {
        roomId: 'A',
        paths:	[(UP | RIGHT | LEFT), RIGHT, (RIGHT | DOWN), (UP | RIGHT | LEFT)],
        clipPaths: [ALL, (RIGHT | DOWN), (RIGHT | DOWN), ALL],
        validEntrances:	ALL,
        validEnemies: [0x10, 0x20, 0x34, 0x37, 0x44, 0x46, 0x47, 0x60, 0x61, 0x62],
    },
    {
        roomId: 'B',
        paths:	[(RIGHT | LEFT), (RIGHT | LEFT), NONE, (RIGHT | LEFT)],
        clipPaths: [(RIGHT | LEFT), (RIGHT | LEFT), NONE, (RIGHT | LEFT)],
        validEntrances:	(UP | RIGHT | LEFT),
        validEnemies: [0x10, 0x20, 0x34, 0x37, 0x44, 0x46, 0x47, 0x60, 0x61, 0x62],
    },
    {
        roomId: 'C',
        paths:	[ALL, ALL, ALL, ALL],
        clipPaths: [ALL, ALL, ALL, ALL],
        validEntrances:	ALL,
        validEnemies: [0x10, 0x20, 0x34, 0x37, 0x44, 0x46, 0x47, 0x60, 0x61, 0x62],
    },
    {
        roomId: 'D',
        paths:	[ALL, ALL, ALL, ALL],
        clipPaths: [ALL, ALL, ALL, ALL],
        validEntrances:	ALL,
        validEnemies: [0x10, 0x20, 0x34, 0x37, 0x44, 0x46, 0x47],
    },
    {
        roomId: 'E',
        paths:	[(UP | RIGHT), (UP | RIGHT), (DOWN, LEFT), (DOWN, LEFT)],
        clipPaths: [ALL, ALL, (DOWN, LEFT), (DOWN, LEFT)],
        validEntrances:	ALL,
        validEnemies: [0x10, 0x20, 0x34, 0x37, 0x44, 0x46, 0x47, 0x60, 0x61, 0x62],
    },
    {
        roomId: 'F',
        paths:	[(UP | RIGHT | DOWN), (UP | RIGHT | DOWN), (UP | RIGHT | DOWN), NONE],
        clipPaths: [(UP | RIGHT | DOWN), (UP | RIGHT | DOWN), (UP | RIGHT | DOWN), NONE],
        validEntrances:	(UP | RIGHT | DOWN),
        validEnemies: [0x10, 0x20, 0x34, 0x37, 0x44, 0x46, 0x47, 0x60, 0x61, 0x62],
    },
    {
        roomId: '10',
        paths:	[NONE, NONE, NONE, NONE],
        clipPaths: [NONE, NONE, NONE, NONE],
        validEntrances:	NONE,
        validEnemies: [],
    },
    {
        roomId: '11',
        paths:	[(UP | RIGHT | DOWN), (UP | RIGHT | DOWN), (UP | RIGHT | DOWN), NONE],
        clipPaths: [(UP | RIGHT | DOWN), (UP | RIGHT | DOWN), (UP | RIGHT | DOWN), NONE],
        validEntrances:	(UP | RIGHT | DOWN),
        validEnemies: [0x10, 0x20, 0x34, 0x37, 0x44, 0x46, 0x47, 0x60, 0x61, 0x62],
    },
    {
        roomId: '12',
        paths:	[(RIGHT | LEFT), (RIGHT | LEFT), NONE, (RIGHT | LEFT)],
        clipPaths: [(RIGHT | LEFT), (RIGHT | LEFT), NONE, (RIGHT | LEFT)],
        validEntrances:	(UP | RIGHT | LEFT),
        validEnemies: [0x10, 0x20, 0x34, 0x37, 0x44, 0x46, 0x47, 0x60, 0x61, 0x62],
    },
    {
        roomId: '13',
        paths:	[(RIGHT | DOWN | LEFT), (RIGHT | DOWN | LEFT), (RIGHT | DOWN | LEFT), (RIGHT | DOWN | LEFT)],
        clipPaths: [(RIGHT | DOWN | LEFT), (RIGHT | DOWN | LEFT), (RIGHT | DOWN | LEFT), (RIGHT | DOWN | LEFT)],
        validEntrances:	ALL,
        validEnemies: [0x50],
    },
    {
        roomId: '14',
        paths:	[(UP | RIGHT | LEFT), (UP | RIGHT | LEFT), NONE, (UP | RIGHT | LEFT)],
        clipPaths: [(UP | RIGHT | LEFT), (UP | RIGHT | LEFT), NONE, (UP | RIGHT | LEFT)],
        validEntrances:	(UP | RIGHT | LEFT),
        validEnemies: [0x10, 0x20, 0x34, 0x37, 0x44, 0x46, 0x47, 0x60, 0x61, 0x62],
    },
    {
        roomId: '15',
        paths:	[(RIGHT | DOWN | LEFT), (RIGHT | DOWN | LEFT), (RIGHT | DOWN | LEFT), (RIGHT | DOWN | LEFT)],
        clipPaths: [(RIGHT | DOWN | LEFT), (RIGHT | DOWN | LEFT), (RIGHT | DOWN | LEFT), (RIGHT | DOWN | LEFT)],
        validEntrances:	ALL,
        validEnemies: [],
    },
    {
        roomId: '16',
        paths:	[(RIGHT | DOWN | LEFT), (RIGHT | DOWN | LEFT), (RIGHT | DOWN | LEFT), (RIGHT | DOWN | LEFT)],
        clipPaths: [(RIGHT | DOWN | LEFT), (RIGHT | DOWN | LEFT), (RIGHT | DOWN | LEFT), (RIGHT | DOWN | LEFT)],
        validEntrances:	ALL,
        validEnemies: [],
    },
    {
        roomId: '17',
        paths:	[(RIGHT | DOWN | LEFT), (RIGHT | DOWN | LEFT), (RIGHT | DOWN | LEFT), (RIGHT | DOWN | LEFT)],
        clipPaths: [(RIGHT | DOWN | LEFT), (RIGHT | DOWN | LEFT), (RIGHT | DOWN | LEFT), (RIGHT | DOWN | LEFT)],
        validEntrances:	ALL,
        validEnemies: [0x10, 0x20, 0x34, 0x37, 0x44, 0x46, 0x47, 0x60, 0x61, 0x62],
    },
    {
        roomId: '18',
        paths:	[(RIGHT | DOWN | LEFT), (RIGHT | DOWN | LEFT), (RIGHT | DOWN | LEFT), (RIGHT | DOWN | LEFT)],
        clipPaths: [(RIGHT | DOWN | LEFT), (RIGHT | DOWN | LEFT), (RIGHT | DOWN | LEFT), (RIGHT | DOWN | LEFT)],
        validEntrances:	ALL,
        validEnemies: [0x10, 0x20, 0x34, 0x37, 0x44, 0x46, 0x47, 0x60, 0x61, 0x62],
    },
    {
        roomId: '19',
        paths:	[ALL, ALL, ALL, ALL],
        clipPaths: [ALL, ALL, ALL, ALL],
        validEntrances:	ALL,
        validEnemies: [0x10, 0x20, 0x34, 0x37, 0x44, 0x46, 0x47, 0x60, 0x61, 0x62],
    },
    {
        roomId: '1A',
        paths:	[ALL, ALL, ALL, ALL],
        clipPaths: [ALL, ALL, ALL, ALL],
        validEntrances:	ALL,
        validEnemies: [0x10, 0x20, 0x34, 0x37, 0x44, 0x46, 0x47, 0x60, 0x61, 0x62],
    },
    {
        roomId: '1B',
        paths:	[LEFT, (RIGHT | DOWN), DOWN, LEFT],
        clipPaths: [LEFT, (RIGHT | DOWN), DOWN, LEFT],
        validEntrances:	ALL,
        validEnemies: [0x10, 0x20, 0x34, 0x37, 0x44, 0x46, 0x47, 0x60, 0x61, 0x62],
    },
    {
        roomId: '1C',
        paths:	[(UP | DOWN), NONE, (UP | DOWN), NONE],
        clipPaths: [(UP | DOWN), NONE, (UP | DOWN), NONE],
        validEntrances:	(UP | DOWN),
        validEnemies: [0x10, 0x20, 0x34, 0x37, 0x44, 0x46, 0x47, 0x60, 0x61, 0x62],
    },
    {
        roomId: '1D',
        paths:	[(UP | DOWN), NONE, (UP | DOWN), NONE],
        clipPaths: [(UP | DOWN), NONE, (UP | DOWN), NONE],
        validEntrances:	(UP | DOWN),
        validEnemies: [0x10, 0x20, 0x34, 0x37, 0x44, 0x46, 0x47, 0x60, 0x61, 0x62],
    },
    {
        roomId: '1E',
        paths:	[ALL, ALL, ALL, LEFT],
        clipPaths: [ALL, ALL, ALL, LEFT],
        validEntrances:	ALL,
        validEnemies: [0x10, 0x20, 0x34, 0x37, 0x44, 0x46, 0x47, 0x60, 0x61, 0x62],
    },
    {
        roomId: '1F',
        paths:	[ALL, ALL, ALL, LEFT],
        clipPaths: [ALL, ALL, ALL, LEFT],
        validEntrances:	ALL,
        validEnemies: [0x10, 0x20, 0x34, 0x37, 0x44, 0x46, 0x47, 0x60, 0x61, 0x62],
    },
    {
        roomId: '20',
        paths:	[ALL, ALL, ALL, ALL],
        clipPaths: [ALL, ALL, ALL, ALL],
        validEntrances:	ALL,
        validEnemies: [0x10, 0x20, 0x34, 0x37, 0x44, 0x46, 0x47, 0x60, 0x61, 0x62],
    },
    {
        roomId: '21',
        paths:	[(UP | RIGHT | DOWN), (UP | RIGHT | DOWN), (UP | RIGHT | DOWN), LEFT],
        clipPaths: [ALL, ALL, ALL, ALL],
        validEntrances:	ALL,
        validEnemies: [0x10, 0x20, 0x34, 0x37, 0x44, 0x46, 0x47, 0x60, 0x61, 0x62],
    },
    {
        roomId: '22',
        paths:	[(UP | RIGHT | DOWN), (UP | RIGHT | DOWN), (UP | RIGHT | DOWN), LEFT],
        clipPaths: [ALL, ALL, ALL, ALL],
        validEntrances:	ALL,
        validEnemies: [0x10, 0x20, 0x34, 0x37, 0x44, 0x46, 0x47, 0x60, 0x61, 0x62],
    },
    {
        roomId: '23',
        paths:	[(UP | RIGHT | DOWN), (UP | RIGHT | DOWN), (UP | RIGHT | DOWN), LEFT],
        clipPaths: [ALL, ALL, ALL, ALL],
        validEntrances:	ALL,
        validEnemies: [0x10, 0x20, 0x34, 0x37, 0x44, 0x46, 0x47, 0x60, 0x61, 0x62],
    },
    {
        roomId: '24',
        paths:	[(UP | RIGHT | DOWN), (UP | RIGHT | DOWN), (UP | RIGHT | DOWN), LEFT],
        clipPaths: [ALL, ALL, ALL, ALL],
        validEntrances:	ALL,
        validEnemies: [0x10, 0x20, 0x34, 0x37, 0x44, 0x46, 0x47, 0x60, 0x61, 0x62],
    },
    {
        roomId: '25',
        paths:	[(UP | RIGHT | DOWN), (UP | RIGHT | DOWN), (UP | RIGHT | DOWN), LEFT],
        clipPaths: [ALL, ALL, ALL, ALL],
        validEntrances:	ALL,
        validEnemies: [0x10, 0x20, 0x34, 0x37, 0x44, 0x46, 0x47, 0x60, 0x61, 0x62],
    },
    {
        roomId: '26',
        paths:	[ALL, (RIGHT | DOWN), (RIGHT | DOWN), ALL],
        clipPaths: [ALL, ALL, ALL, ALL],
        validEntrances:	ALL,
        validEnemies: [0x10, 0x20, 0x34, 0x37, 0x44, 0x46, 0x47, 0x60, 0x61, 0x62],
    },
    {
        roomId: '27',
        paths:	[ALL, (RIGHT | DOWN), (RIGHT | DOWN), ALL],
        clipPaths: [ALL, ALL, ALL, ALL],
        validEntrances:	ALL,
        validEnemies: [0x10, 0x20, 0x34, 0x37, 0x44, 0x46, 0x47, 0x60, 0x61, 0x62],
    },
    {
        roomId: '28',
        paths:	[(UP | RIGHT | LEFT), (UP | RIGHT | LEFT), NONE, (UP | RIGHT | LEFT)],
        clipPaths: [(UP | RIGHT | LEFT), (UP | RIGHT | LEFT), NONE, (UP | RIGHT | LEFT)],
        validEntrances:	(UP | RIGHT | LEFT),
        validEnemies: [],
    },
    {
        //Boss Room
        roomId: '29',
        paths:	[NONE, NONE, NONE, NONE],
        clipPaths: [NONE, NONE, NONE, NONE],
        validEntrances:	NONE,
        validEnemies: [0xF0]
    },
]

//Useful to get a possible room coming from direction
function getRoomsOpenToDirection(direction) {
    var validRooms = [];
    for(var i = 0; i < rooms.length; i++) {
        if((rooms[i].validEntrances & direction) == direction) {
            validRooms.push(rooms[i])
        }
    }

    return validRooms
}

module.exports = {
    getRoomsOpenToDirection,
    rooms,
    UP, RIGHT, DOWN, LEFT, ALL, NONE, DIRECTIONS, DIR_INDEX
}