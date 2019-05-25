
//List of room pointers that we can overwrite
const POINTERS_TO_OVERWRITE = [
    0x1b13a, //0x05
    0x1b13c, //0x06
    0x1b142, //0x09
    0x1b14a, //0x0d
    0x1b152, //0x11
    0x1b15e, //0x17
    0x1b160, //0x18
    0x1b164, //0x1d
    0x1b169, //0x1f
    0x1b16e, //0x22
    0x1b174, //0x23
    0x1b176, //0x24
    0x1b178, //0x25
    0x1b17a  //0x27
]

//Fortress 2 has a copy of the pointers, they're all identical, so we just need to offset the locations
const POINTERS_TO_OVERWRITE_F2 = [
    0x1b13a + 0x2f4, //0x05
    0x1b13c + 0x2f4, //0x06
    0x1b142 + 0x2f4, //0x09
    0x1b14a + 0x2f4, //0x0d
    0x1b152 + 0x2f4, //0x11
    0x1b15e + 0x2f4, //0x17
    0x1b160 + 0x2f4, //0x18
    0x1b164 + 0x2f4, //0x1d
    0x1b169 + 0x2f4, //0x1f
    0x1b16e + 0x2f4, //0x22
    0x1b174 + 0x2f4, //0x23
    0x1b176 + 0x2f4, //0x24
    0x1b178 + 0x2f4, //0x25
    0x1b17a + 0x2f4  //0x27
]

//Fortress 3 also has a copy of the pointers, they're all identical, so we just need to offset the locations
const POINTERS_TO_OVERWRITE_F3 = [
    0x1b13a + 0x5c8, //0x05
    0x1b13c + 0x5c8, //0x06
    0x1b142 + 0x5c8, //0x09
    0x1b14a + 0x5c8, //0x0d
    0x1b152 + 0x5c8, //0x11
    0x1b15e + 0x5c8, //0x17
    0x1b160 + 0x5c8, //0x18
    0x1b164 + 0x5c8, //0x1d
    0x1b169 + 0x5c8, //0x1f
    0x1b16e + 0x5c8, //0x22
    0x1b174 + 0x5c8, //0x23
    0x1b176 + 0x5c8, //0x24
    0x1b178 + 0x5c8, //0x25
    0x1b17a + 0x5c8  //0x27
]

const overwrittenRooms = [
    0x05,
    0x06, 
    0x09,
    0x0d,
    0x11,
    0x17,
    0x18,
    0x1d,
    0x1f,
    0x22,
    0x23,
    0x24,
    0x25,
    0x27
]

//Start of where we can write new room data
const ROOM_START = 0x16500;

//this is the real address equivilant of 0x16500
//we need this to calculate the offsets of the room data
const ROOM_START_REAL_ADDR= 0xa4f0;


//we have 0x310 bytes to use for new rooms (i think...)
const MAX_ROOM_DATA_LENGTH = 0x310;

const FBS_ROOM1_DATA = [
    0x01,               //I don't know what this 0x01 byte is for, but all the rooms have it.
    0x10, 0x04, 0x01,
    0x60, 0x04, 0x01,
    0x1f, 0x04, 0x01,
    0x6f, 0x04, 0x01,
    0x00, 0x05, 0x01,
    0x04, 0x05, 0x01,
    0x08, 0x05, 0x01,
    0x0c, 0x05, 0x01,
    0xb4, 0x05, 0x01,
    0xb8, 0x05, 0x01,
    0x01, 0x10, 0x03,
    0x0e, 0x10, 0x03,
    0x21, 0x05, 0x01,
    0x2b, 0x05, 0x01,
    0x31, 0x08, 0x02,
    0x3b, 0x08, 0x02,
    0x80, 0x0a, 0x01,
    0x8c, 0x0a, 0x01,
    0x06, 0x0a, 0x01,
    0x46, 0x08, 0x02,
    0x17, 0x0d, 0x04,
    0x91, 0x0d, 0x04,
    0x9d, 0x0d, 0x04,                
    0xFD, 0xFF          //All rooms end in 0xFD, 0xFF
]

const RUMBLE_ROOM1_DATA = [
    0x01,
    0x01, 0x05, 0x01,
    0x05, 0x05, 0x01,
    0x09, 0x05, 0x01,
    0x0c, 0x05, 0x01,
    0x1f, 0x04, 0x01,
    0x10, 0x04, 0x01,    
    0x70, 0x04, 0x01,
    0x7f, 0x04, 0x01,    
    0xb1, 0x01, 0x04,
    0xb8, 0x01, 0x04,    
    0x76, 0x0a, 0x01,
    0x13, 0x04, 0x01,
    0x43, 0x04, 0x01,    
    0x47, 0x04, 0x01,
    0x48, 0x04, 0x01,    
    0x1c, 0x04, 0x01,
    0x4c, 0x04, 0x01,
    0x73, 0x09, 0x04,
    0x7c, 0x09, 0x04,
    0x36, 0x0b, 0x01,
    0x39, 0x0b, 0x01,    
    0x81, 0x0e, 0x01,
    0x84, 0x0e, 0x01,    
    0x8a, 0x0e, 0x01,
    0x8d, 0x0e, 0x01,    
    0xFD, 0xFF
]

const ANGRY_IRISH_SNAKE_ROOM = [
    0x01,
    0x00, 0x05, 0x1,
    0x04, 0x05, 0x1,
    0x06, 0x05, 0x1,
    0x0B, 0x05, 0x1,
    0x0C, 0x05, 0x1,
    0x30, 0x02, 0x1,
    0x60, 0x02, 0x1,
    0x80, 0x02, 0x1,
    0x82, 0x02, 0x1,
    0x64, 0x02, 0x1,
    0x52, 0x19, 0x1,
    0x30, 0x19, 0x1,
    0x35, 0x19, 0x1,
    0x95, 0x0E, 0x1,
    0x28, 0x19, 0x1,
    0x5A, 0x0E, 0x1,
    0x79, 0x02, 0x1,
    0x3D, 0x07, 0x1,
    0x3E, 0x07, 0x1,
    0x4D, 0x02, 0x1,
    0x8C, 0x0F, 0x1,
    0x0C, 0x10, 0x3,
    0x4F, 0x02, 0x1,
    0x8F, 0x02, 0x1,
    0x02, 0x10, 0x3,
    0xB1, 0x05, 0x1,
    0xB5, 0x05, 0x1,
    0xB6, 0x05, 0x1,
    0xBB, 0x05, 0x1,
    0xFD, 0xFF
]

const ANGRY_IRISH_SNAKE_ROOM2 = [
    0x01,
    0x00, 0x05, 0x01, 
    0x04, 0x05, 0x01,
    0x08, 0x05, 0x01,
    0x09, 0x05, 0x01,
    0x0C, 0x05, 0x01,
    0x20, 0x02, 0x01, 
    0x2F, 0x02, 0x01,
    0x53, 0x02, 0x01, 
    0x46, 0x02, 0x01, 
    0x49, 0x02, 0x01, 
    0x5C, 0x02, 0x01, 
    0x79, 0x19, 0x01,
    0x76, 0x19, 0x01,
    0x73, 0x19, 0x01,
    0x60, 0x02, 0x01, 
    0x6F, 0x02, 0x01, 
    0x80, 0x02, 0x01, 
    0x81, 0x02, 0x01, 
    0x8E, 0x02, 0x01, 
    0x8F, 0x02, 0x01, 
    0xB1, 0x01, 0x04, 
    0xB8, 0x01, 0x04,
    0xFD, 0xFF  
]

const FBS_ROOM2_DATA = [
    0x01,
    0xB1, 0x01, 0x04, 
    0xB8, 0x01, 0x04,               
    0x40, 0x02, 0x01,
    0x80, 0x02, 0x01,
    0x81, 0x02, 0x01,
    0x4f, 0x02, 0x01,
    0x8f, 0x02, 0x01,
    0x8e, 0x02, 0x01,
    0xa2, 0x12, 0x01,
    0xa6, 0x12, 0x01,
    0xaa, 0x12, 0x01,
    0x65, 0x0e, 0x01,
    0x69, 0x0e, 0x01,
    0xFD, 0xFF  
]

const rooms = [
    FBS_ROOM1_DATA,
    RUMBLE_ROOM1_DATA,
    ANGRY_IRISH_SNAKE_ROOM,
    ANGRY_IRISH_SNAKE_ROOM2,
    FBS_ROOM2_DATA
]

const UP = 0x1;
const RIGHT = 0x2;
const DOWN = 0x4;
const LEFT = 0x8;
const ALL = UP | RIGHT | DOWN | LEFT;
const NONE = 0x0;

//This room info is passed to the dungeon randomizer so it knows how to use the new rooms.
//roomokay, validEnemies, and roomIdNum is used by fbs's generator, the rest is used by rumbleminze's
const NEW_ROOM_INFO = [
    {
        roomIdNum: overwrittenRooms[0],
        roomId: overwrittenRooms[0].toString(16),
        paths: [(NONE),(RIGHT|DOWN|LEFT),(RIGHT|DOWN|LEFT),(RIGHT|DOWN|LEFT)],
        clipPaths: [(NONE),(RIGHT|DOWN|LEFT),(RIGHT|DOWN|LEFT),(RIGHT|DOWN|LEFT)],
        validEntrances: (RIGHT|DOWN|LEFT),
        validEnemies: [0x10, 0x20, 0x32, 0x42, 0x61],
        roomokay: 0b1110
    },{
        roomIdNum: overwrittenRooms[1],
        roomId: overwrittenRooms[1].toString(16),
        paths: [(RIGHT|LEFT|UP),(RIGHT|LEFT|UP),NONE,(RIGHT|UP|LEFT)],
        clipPaths:[(RIGHT|LEFT|UP),(RIGHT|LEFT|UP),NONE,(RIGHT|UP|LEFT)],
        validEntrances: (RIGHT|LEFT|UP),
        validEnemies: [0x10, 0x20, 0x35, 0x45],
        roomokay: 0b1011
    },{
        roomIdNum: overwrittenRooms[2],
        roomId: overwrittenRooms[2].toString(16),
        paths: [ALL,ALL,ALL,ALL],
        clipPaths:  [ALL,ALL,ALL,ALL],
        validEntrances: ALL,
        validEnemies: [0x10, 0x20, 0x34, 0x44],
        roomokay: 0b1111
    },{
        roomIdNum: overwrittenRooms[3],
        roomId: overwrittenRooms[3].toString(16),
        paths: [ALL,ALL,ALL,ALL],
        clipPaths:  [ALL,ALL,ALL,ALL],
        validEntrances: ALL,
        validEnemies: [0x10, 0x20, 0x34, 0x44, 61],
        roomokay: 0b1111
    },{
        roomIdNum: overwrittenRooms[4],
        roomId: overwrittenRooms[4].toString(16),
        paths: [(RIGHT|LEFT),(RIGHT|LEFT),NONE,(RIGHT|LEFT)],
        clipPaths:[(RIGHT|LEFT),(RIGHT|LEFT),NONE,(RIGHT|LEFT)],
        validEntrances: (RIGHT|LEFT),
        validEnemies: [0x10, 0x20, 0x61],
        roomokay: 0b1010
    },
]

//data for points to the new room locations, these are "real" addresses
let roomPointers = []
roomPointers[0] = ROOM_START_REAL_ADDR;
roomPointers[1] = roomPointers[0] + rooms[0].length
roomPointers[2] = roomPointers[1] + rooms[1].length
roomPointers[3] = roomPointers[2] + rooms[2].length
roomPointers[4] = roomPointers[3] + rooms[3].length

//Locations in the rom of the room info, these are "rom" addresses
let roomDataLocations = [];
roomDataLocations[0] = ROOM_START;
roomDataLocations[1] = roomDataLocations[0] + rooms[0].length
roomDataLocations[2] = roomDataLocations[1] + rooms[1].length
roomDataLocations[3] = roomDataLocations[2] + rooms[2].length
roomDataLocations[4] = roomDataLocations[3] + rooms[3].length

//Converts a 2-byte hex number to an array in reverse order, which is how the pointers
// are stored in the ROM (from 9AC3 to [C3,9A])
function littleEndien(value) {
    let lowerByte = (value & (0x00ff));
    let higherByte = ((value & 0xff00)) >> 8;

    return [lowerByte, higherByte]
}

function getRoomPatches(){


    let ROOM_PATCHES = [];
    var totalRoomPatchSize = 0;
    for (var i = 0; i < rooms.length; i++) {
        console.log("New pointer: " + littleEndien(roomPointers[i])[0].toString(16) + " " + littleEndien(roomPointers[i])[1].toString(16))
        let pointer = littleEndien(roomPointers[i]);
        let pointerPatch = {
            name: "Pointer Update for new room " + (i+1),
            offset: POINTERS_TO_OVERWRITE[i],
            data: pointer
        }

        let pointerPatch2 = {
            name: "Pointer Update for fortress 2 new room " + (i+1),
            offset: POINTERS_TO_OVERWRITE_F2[i],
            data: pointer
        }

        let pointerPatch3 = {
            name: "Pointer Update for fortress 3 new room " + (i+1),
            offset: POINTERS_TO_OVERWRITE_F3[i],
            data: pointer
        }

        let roomDataPatch = {
            name: "Room Data for room " + (i+1),
            offset: roomDataLocations[i],
            data: rooms[i]
        }

        totalRoomPatchSize += roomDataPatch.length;

        if (totalRoomPatchSize > MAX_ROOM_DATA_LENGTH) {
            console.log("********************************************************")
            console.log("********************************************************")
            console.log("NOT PROCESSING ANY FURTHER ROOM PATCHES, WE'RE OVER SIZE")
            console.log("********************************************************")
            console.log("********************************************************")
            continue;
        }

        ROOM_PATCHES.push(pointerPatch);
        ROOM_PATCHES.push(pointerPatch2);
        ROOM_PATCHES.push(pointerPatch3);
        ROOM_PATCHES.push(roomDataPatch);
    }

    console.log(JSON.stringify(ROOM_PATCHES))

    return ROOM_PATCHES;
}
module.exports = {getRoomPatches, NEW_ROOM_INFO}