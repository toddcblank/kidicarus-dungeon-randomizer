//roomId - id in Kid Icaraus, also cooresponds to image of room
//paths - array for paths FROM TRBL of room to TBRL of room.  i.e. [F, F, F, F] would be a 4 way room that you can go any direction
//        [(UP | RIGHT | DOWN), (UP | RIGHT | DOWN), (UP | RIGHT | DOWN), (UP | RIGHT | DOWN)] would mean all entrences can go TBR but none can go L
//clipPaths - same as paths, but for if the person can do the wall clips
//validEntrances:  TRBL hex value of where you can enter the room from.  i.e. the vertical rooms would be 1 + 2 + 0 + 0 = 3

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

//These are actually just the first byte of the enemies.  I use these to denote that we should spawn that type.
//The rooms themselves have which specific enemy + position they support
const RED = 0x30;
const BLUE = 0x40;
const FLYING_EASY = 0x10;
const FLYING_HARD = 0x20;
const EGGPLANT = 0x60;

//These enemies will fill in empty rooms after the QUEUES for that world/difficulty have been placed
//They'll be placed in order, then repeated.
const ENEMY_FILLS_BY_DIFF = []
ENEMY_FILLS_BY_DIFF[1] = [RED, BLUE, RED, BLUE]
ENEMY_FILLS_BY_DIFF[2] = [RED, BLUE, RED]
ENEMY_FILLS_BY_DIFF[3] = [BLUE, RED, BLUE, FLYING_HARD]

//These enemies will be placed first (after the boss and spikes), followed by filling in empty rooms from the FILLER array
const ENEMY_QUEUES_BY_WORLD_AND_DIFF = []
ENEMY_QUEUES_BY_WORLD_AND_DIFF[1] = []
ENEMY_QUEUES_BY_WORLD_AND_DIFF[2] = []
ENEMY_QUEUES_BY_WORLD_AND_DIFF[3] = []
ENEMY_QUEUES_BY_WORLD_AND_DIFF[1][1] = [
    EGGPLANT, FLYING_HARD, FLYING_EASY, FLYING_EASY
]
ENEMY_QUEUES_BY_WORLD_AND_DIFF[1][2] = [
    EGGPLANT, EGGPLANT, FLYING_HARD, FLYING_HARD, FLYING_EASY, FLYING_EASY
]
ENEMY_QUEUES_BY_WORLD_AND_DIFF[1][3] = [
    EGGPLANT, EGGPLANT, EGGPLANT, FLYING_HARD, FLYING_HARD, FLYING_HARD, FLYING_EASY
]

ENEMY_QUEUES_BY_WORLD_AND_DIFF[2][1] = [
    EGGPLANT, EGGPLANT, FLYING_HARD, FLYING_HARD, FLYING_EASY, FLYING_EASY
]
ENEMY_QUEUES_BY_WORLD_AND_DIFF[2][2] = [
    EGGPLANT, EGGPLANT, EGGPLANT, FLYING_HARD, FLYING_HARD, FLYING_EASY
]
ENEMY_QUEUES_BY_WORLD_AND_DIFF[2][3] = [
    EGGPLANT, EGGPLANT, EGGPLANT, FLYING_HARD, FLYING_HARD, FLYING_HARD, FLYING_EASY
]

ENEMY_QUEUES_BY_WORLD_AND_DIFF[3][1] = [
    EGGPLANT, EGGPLANT, FLYING_HARD, FLYING_HARD, FLYING_EASY, FLYING_EASY, FLYING_EASY, FLYING_EASY
]
ENEMY_QUEUES_BY_WORLD_AND_DIFF[3][2] = [
    EGGPLANT, EGGPLANT, EGGPLANT, FLYING_HARD, FLYING_HARD, FLYING_HARD, FLYING_HARD, FLYING_EASY
]
ENEMY_QUEUES_BY_WORLD_AND_DIFF[3][3] = [
    EGGPLANT, EGGPLANT, EGGPLANT, EGGPLANT, EGGPLANT, FLYING_HARD, FLYING_HARD, FLYING_HARD, FLYING_HARD, FLYING_HARD, FLYING_EASY
]

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
        validEnemies: [0x10, 0x20, 0x31, 0x41, 0x60, 0x61, 0x62],
    },
    {
        roomId: '3',
        paths:	[ALL, ALL, ALL, ALL],
        clipPaths: [ALL, ALL, ALL, ALL],
        validEntrances:	ALL,
        validEnemies: [0x10, 0x20, 0x32, 0x42, 0x32, 0x42, 0x60],
    },
    {
        roomId: '4',
        paths:	[ALL, ALL, ALL, ALL],
        clipPaths: [ALL, ALL, ALL, ALL],
        validEntrances:	ALL,
        validEnemies: [0x10, 0x20, 0x30, 0x32, 0x40, 0x42, 0x61],
    },
    {
        roomId: '5',
        paths:	[ALL, ALL, ALL, ALL],
        clipPaths: [ALL, ALL, ALL, ALL],
        validEntrances:	ALL,
        validEnemies: [0x10, 0x20, 0x30, 0x32, 0x40, 0x42, 0x61],
    },
    {
        roomId: '6',
        paths:	[ALL, ALL, ALL, ALL],
        clipPaths: [ALL, ALL, ALL, ALL],
        validEntrances:	ALL,
        validEnemies: [0x10, 0x20, 0x30, 0x32, 0x40, 0x42, 0x61],
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
        validEnemies:	[0x10, 0x20, 0x31, 0x41, 0x60],
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
        validEnemies: [0x10, 0x20, 0x30, 0x40, 0x62],
    },
    {
        roomId: 'B',
        paths:	[(RIGHT | LEFT), (RIGHT | LEFT), NONE, (RIGHT | LEFT)],
        clipPaths: [(RIGHT | LEFT), (RIGHT | LEFT), NONE, (RIGHT | LEFT)],
        validEntrances:	(UP | RIGHT | LEFT),
        validEnemies: [0x10, 0x20, 0x10, 0x20, 0x61],
    },
    {
        roomId: 'C',
        paths:	[ALL, ALL, ALL, ALL],
        clipPaths: [ALL, ALL, ALL, ALL],
        validEntrances:	ALL,
        validEnemies: [0x10, 0x20, 0x36, 0x46],
    },
    {
        roomId: 'D',
        paths:	[ALL, ALL, ALL, ALL],
        clipPaths: [ALL, ALL, ALL, ALL],
        validEntrances:	ALL,
        validEnemies: [0x10, 0x20, 0x36, 0x46],
    },
    {
        roomId: 'E',
        paths:	[(UP | RIGHT), (UP | RIGHT), (DOWN, LEFT), (DOWN, LEFT)],
        clipPaths: [ALL, ALL, (DOWN, LEFT), (DOWN, LEFT)],
        validEntrances:	ALL,
        validEnemies: [0x10, 0x20, 0x30, 0x40, 0x30, 0x40, 0x61, 0x63],
    },
    {
        roomId: 'F',
        paths:	[(UP | RIGHT | DOWN), (UP | RIGHT | DOWN), (UP | RIGHT | DOWN), NONE],
        clipPaths: [(UP | RIGHT | DOWN), (UP | RIGHT | DOWN), (UP | RIGHT | DOWN), NONE],
        validEntrances:	(UP | RIGHT | DOWN),
        validEnemies: [0x10, 0x20, 0x30, 0x40, 0x30, 0x40, 0x60, 0x61],
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
        validEnemies: [0x10, 0x20, 0x30, 0x40, 0x30, 0x40, 0x60, 0x61],
    },
    {
        roomId: '12',
        paths:	[(RIGHT | LEFT), (RIGHT | LEFT), NONE, (RIGHT | LEFT)],
        clipPaths: [(RIGHT | LEFT), (RIGHT | LEFT), NONE, (RIGHT | LEFT)],
        validEntrances:	(UP | RIGHT | LEFT),
        validEnemies: [0x10, 0x20, 0x32, 0x42],
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
        validEnemies: [0x10, 0x20, 0x36, 0x46, 0x36, 0x46, 0x62, 0x63],
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
        validEnemies: [0x10, 0x20, 0x10, 0x20, 0x61],
    },
    {
        roomId: '18',
        paths:	[(RIGHT | DOWN | LEFT), (RIGHT | DOWN | LEFT), (RIGHT | DOWN | LEFT), (RIGHT | DOWN | LEFT)],
        clipPaths: [(RIGHT | DOWN | LEFT), (RIGHT | DOWN | LEFT), (RIGHT | DOWN | LEFT), (RIGHT | DOWN | LEFT)],
        validEntrances:	ALL,
        validEnemies: [0x10, 0x20, 0x10, 0x20, 0x61],
    },
    {
        roomId: '19',
        paths:	[ALL, ALL, ALL, ALL],
        clipPaths: [ALL, ALL, ALL, ALL],
        validEntrances:	ALL,
        validEnemies: [0x10, 0x20, 0x37, 0x47, 0x60, 0x61],
    },
    {
        roomId: '1A',
        paths:	[ALL, ALL, ALL, ALL],
        clipPaths: [ALL, ALL, ALL, ALL],
        validEntrances:	ALL,
        validEnemies: [0x10, 0x20, 0x32, 0x42, 0x60],
    },
    {
        roomId: '1B',
        paths:	[LEFT, (RIGHT | DOWN), DOWN, LEFT],
        clipPaths: [LEFT, (RIGHT | DOWN), DOWN, LEFT],
        validEntrances:	ALL,
        validEnemies: [0x10, 0x20, 0x33, 0x43, 0x60],
    },
    {
        roomId: '1C',
        paths:	[(UP | DOWN), NONE, (UP | DOWN), NONE],
        clipPaths: [(UP | DOWN), NONE, (UP | DOWN), NONE],
        validEntrances:	(UP | DOWN),
        validEnemies: [0x53],
    },
    {
        roomId: '1D',
        paths:	[(UP | DOWN), NONE, (UP | DOWN), NONE],
        clipPaths: [(UP | DOWN), NONE, (UP | DOWN), NONE],
        validEntrances:	(UP | DOWN),
        validEnemies: [0x53],
    },
    {
        roomId: '1E',
        paths:	[ALL, ALL, ALL, LEFT],
        clipPaths: [ALL, ALL, ALL, LEFT],
        validEntrances:	ALL,
        validEnemies: [0x10, 0x20, 0x37, 0x47, 0x60],
    },
    {
        roomId: '1F',
        paths:	[ALL, ALL, ALL, LEFT],
        clipPaths: [ALL, ALL, ALL, LEFT],
        validEntrances:	ALL,
        validEnemies: [0x10, 0x20, 0x37, 0x47, 0x60],
    },
    {
        roomId: '20',
        paths:	[ALL, ALL, ALL, ALL],
        clipPaths: [ALL, ALL, ALL, ALL],
        validEntrances:	ALL,
        validEnemies: [0x52],
    },
    {
        roomId: '21',
        paths:	[(UP | RIGHT | DOWN), (UP | RIGHT | DOWN), (UP | RIGHT | DOWN), LEFT],
        clipPaths: [ALL, ALL, ALL, ALL],
        validEntrances:	ALL,
        validEnemies: [0x10, 0x20, 0x31, 0x41, 0x61],
    },
    {
        roomId: '22',
        paths:	[(UP | RIGHT | DOWN), (UP | RIGHT | DOWN), (UP | RIGHT | DOWN), LEFT],
        clipPaths: [ALL, ALL, ALL, ALL],
        validEntrances:	ALL,
        validEnemies: [0x10, 0x20, 0x31, 0x41, 0x61],
    },
    {
        roomId: '23',
        paths:	[(UP | RIGHT | DOWN), (UP | RIGHT | DOWN), (UP | RIGHT | DOWN), LEFT],
        clipPaths: [ALL, ALL, ALL, ALL],
        validEntrances:	ALL,
        validEnemies: [0x10, 0x20, 0x31, 0x41, 0x61],
    },
    {
        roomId: '24',
        paths:	[(UP | RIGHT | DOWN), (UP | RIGHT | DOWN), (UP | RIGHT | DOWN), LEFT],
        clipPaths: [ALL, ALL, ALL, ALL],
        validEntrances:	ALL,
        validEnemies: [0x10, 0x20, 0x31, 0x41, 0x61],
    },
    {
        roomId: '25',
        paths:	[(UP | RIGHT | DOWN), (UP | RIGHT | DOWN), (UP | RIGHT | DOWN), LEFT],
        clipPaths: [ALL, ALL, ALL, ALL],
        validEntrances:	ALL,
        validEnemies: [0x10, 0x20, 0x31, 0x41, 0x61],
    },
    {
        roomId: '26',
        paths:	[ALL, (RIGHT | DOWN), (RIGHT | DOWN), ALL],
        clipPaths: [ALL, ALL, ALL, ALL],
        validEntrances:	ALL,
        validEnemies: [0x10, 0x20, 0x32, 0x42, 0x63],
    },
    {
        roomId: '27',
        paths:	[ALL, (RIGHT | DOWN), (RIGHT | DOWN), ALL],
        clipPaths: [ALL, ALL, ALL, ALL],
        validEntrances:	ALL,
        validEnemies: [0x10, 0x20, 0x32, 0x42, 0x63],
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
    UP, RIGHT, DOWN, LEFT, ALL, NONE, DIRECTIONS, DIR_INDEX,
    ENEMY_QUEUES_BY_WORLD_AND_DIFF,
    ENEMY_FILLS_BY_DIFF,
    EGGPLANT,
    FLYING_EASY,
    FLYING_HARD,
    RED,
    BLUE    
}