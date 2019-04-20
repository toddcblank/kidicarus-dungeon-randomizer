let dg = require('./generate-dungeon')
let rp = require('./rom-patcher')
let romPath = './public/generated-seeds/'
let fs = require('fs')

let ADD_MAP_PATCH_D14 = {
    data: ["1b", "88", 'FF'],
    offset: 0x1b2c4
}

let ADD_MAP_PATCH_D24 = {
    data: ["1b", "88", 'FF'],
    offset: 0x1b5b8
}

let ADD_MAP_PATCH_D34 = {
    data: ["1b", "88", 'FF'],
    offset: 0x1B88C
}

let ENEMY_POSITION_PATCH_D1 = {
    data: "44 74 A8 7C 44 6D A2 AA 74 56 5A 7B 73 77 7D AA 44 72 19 AD A2 54 49 AC 48 77 73 7A 56 5A A5 AD 4C 64 8C A4 43 01 4C 01 76 00 8D 00 75 02 75 00 75 03 8A 00 43 01 43 03 AB 00 AB 02 35 03 65 03 86 03 8A 02 44 A6 A4 A8 36 87 36 87".split(" "),
    offset: 0x1B278
}

let ENEMY_POSITION_PATCH_D2 = {
    data: "44 74 A8 7C 44 6D A2 AA 74 56 5A 7B 73 77 7D AA 44 72 19 AD A2 54 49 AC 48 77 73 7A 56 5A A5 AD 4C 64 8C A4 43 01 4C 01 76 00 8D 00 75 02 75 00 75 03 8A 00 43 01 43 03 AB 00 AB 02 35 03 65 03 86 03 8A 02 44 A6 A4 A8 36 87 36 87".split(" "),
    offset: 0x1B56C
}

let ENEMY_POSITION_PATCH_D3 = {
    data: "44 74 A8 7C 44 6D A2 AA 74 56 5A 7B 73 77 7D AA 44 72 19 AD A2 54 49 AC 48 77 73 7A 56 5A A5 AD 4C 64 8C A4 43 01 4C 01 76 00 8D 00 75 02 75 00 75 03 8A 00 43 01 43 03 AB 00 AB 02 35 03 65 03 86 03 8A 02 44 A6 A4 A8 36 87 36 87".split(" "),
    offset: 0x1B840
}

dungeonLevelOffsets = [0, 0x1b1b8, 0x1b4ac, 0x1b780]
scrollingLevelOffsets = [[], [0, 0x1a56b, ,0x1a584, 0x1a5a2], [], []]


function createNewRandomizedRom(skipSpoilers=false, romname) {
    let seed = new Date().getTime();
    let newFilename = 'ki-' + seed;

    let dungeon1 = dg.kiDungeonGen(20, 35, 60, 0, 1, 1, 1, 0x29, 5);
    let dungeon2 = dg.kiDungeonGen(35, 45, 30, 8, 2, 1, 1, 0x0b, 7);
    let dungeon3 = dg.kiDungeonGen(50, 64, 20, 8, 3, 1, 1, 0x29, 10)
    
    let dungeon1Patch = {
        data: dungeon1,
        offset: dungeonLevelOffsets[1]
    }

    let dungeon2Patch = {
        data: dungeon2,
        offset: dungeonLevelOffsets[2]
    }

    let dungeon3Patch = {
        data: dungeon3,
        offset: dungeonLevelOffsets[3]
    }

    let htmlSpoiler = printMaze(dungeon1);
    let htmlSpoiler2 = printMaze(dungeon2);    
    let htmlSpoiler3 = printMaze(dungeon3);

    patches = [];
    if(!skipSpoilers){
        fs.open(romPath + newFilename + '-1-4.html', 'a', (err, fd) => {
            if (err) {
                console.log(err)
                return;
            }
            fs.write(fd, htmlSpoiler, 0, 'utf-8',(err, writte, str) => {
                console.log("Wrote html spoiler")
            });
        })

        fs.open(romPath + newFilename + '-2-4.html', 'a', (err, fd) => {
            if (err) {
                console.log(err)
                return;
            }
            fs.write(fd, htmlSpoiler2, 0, 'utf-8',(err, writte, str) => {
                console.log("Wrote html spoiler")
            });
        })

        fs.open(romPath + newFilename + '-3-4.html', 'a', (err, fd) => {
            if (err) {
                console.log(err)
                return;
            }
            fs.write(fd, htmlSpoiler3, 0, 'utf-8',(err, writte, str) => {
                console.log("Wrote html spoiler")
            });
        })
    }

    rp.copyOriginalRom(romname, romPath + newFilename + ".nes");
    rp.patchRom(dungeon1Patch, romPath + newFilename + ".nes");
    rp.patchRom(dungeon2Patch, romPath + newFilename + ".nes");    
    rp.patchRom(dungeon3Patch, romPath + newFilename + ".nes");
    rp.patchRom(ADD_MAP_PATCH_D14, romPath + newFilename + ".nes");
    rp.patchRom(ADD_MAP_PATCH_D24, romPath + newFilename + ".nes");
    rp.patchRom(ADD_MAP_PATCH_D34, romPath + newFilename + ".nes");
    rp.patchRom(ENEMY_POSITION_PATCH_D1, romPath + newFilename + ".nes");
    rp.patchRom(ENEMY_POSITION_PATCH_D2, romPath + newFilename + ".nes");
    rp.patchRom(ENEMY_POSITION_PATCH_D3, romPath + newFilename + ".nes");

    return seed;   
}

function printMaze(mazePatch) {
    var htmlSpoiler = '<html><head><link rel="stylesheet" type="text/css" href="../stylesheets/dungeon.css" /></head><body>'
    htmlSpoiler += '<div class="maze">'
    mazeBytes = mazePatch
    var line = ""
    for (var index = 0; index < 128; index = index + 2) {
        
        var imgName = mazeBytes[index].toString(16) + ".png"
        if (mazeBytes[index].length < 2) {
            imgName = "0" + imgName;
        }

        let openings = parseInt(mazeBytes[index+1], 16);
        line += '<div class="room open-' + mazeBytes[index+1] + '">'
        if ((openings & 0x01) == 1) {
            line += '<img class="opening-img" src="../images/open-up.png" />';
        }

        if ((openings & 0x02) == 0x02) {
            line += '<img class="opening-img" src="../images/open-right.png" />';
        }

        if ((openings & 0x04) == 0x04) {
            line += '<img class="opening-img" src="../images/open-down.png" />';
        }

        if ((openings & 0x08) == 0x08) {
            line += '<img class="opening-img" src="../images/open-left.png" />';
        }

        line += '<img class="roomImage" src="../images/' + imgName + '"/></div>'

    }
    htmlSpoiler += line;
    htmlSpoiler += "<div></body></html>";
    return htmlSpoiler;

}

module.exports = {createNewRandomizedRom}
