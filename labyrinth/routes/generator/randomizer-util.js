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

//TODO: find offsets for 2-4 and 3-4
dungeonLevelOffsets = [0, 0x1b1b8, 0x1b4ac, 0x1b780]

function createNewRandomizedRom() {
    let seed = new Date().getTime();
    let newFilename = 'ki-' + seed;

    let dungeon1 = dg.kiDungeonGen(20, 35, 60, 0, 1, 1, 1, 0x29);
    let dungeon2 = dg.kiDungeonGen(35, 45, 30, 8, 2, 1, 1, 0x0b);
    let dungeon3 = dg.kiDungeonGen(50, 64, 20, 8, 3, 1, 1, 0x29)
    
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

    rp.copyOriginalRom('ki-orig.nes', romPath + newFilename + ".nes");
    rp.patchRom(dungeon1Patch, romPath + newFilename + ".nes");
    rp.patchRom(dungeon2Patch, romPath + newFilename + ".nes");    
    rp.patchRom(dungeon3Patch, romPath + newFilename + ".nes");
    rp.patchRom(ADD_MAP_PATCH_D14, romPath + newFilename + ".nes");
    rp.patchRom(ADD_MAP_PATCH_D24, romPath + newFilename + ".nes");
    rp.patchRom(ADD_MAP_PATCH_D34, romPath + newFilename + ".nes");

    return seed;   
}

function printMaze(mazePatch) {
    var htmlSpoiler = '<html><head><link rel="stylesheet" type="text/css" href="../stylesheets/dungeon.css" /></head><body>'
    htmlSpoiler += '<div class="maze">'
    mazeBytes = mazePatch
    var line = ""
    for (var index = 0; index < 128; index = index + 2) {
        
        if (index%16 == 0) {
            line = '<div class="row">'
        }

        var imgName = mazeBytes[index].toString(16) + ".png"
        if (mazeBytes[index].length < 2) {
            imgName = "0" + imgName;
        }

        line += '<div class="room open-' + mazeBytes[index+1] + '"><img class="roomImage" src="../images/' + imgName + '"/></div>'

        if (index%16 == 14) {
            line += '</div>';
            htmlSpoiler += line;
        }
    }

    htmlSpoiler += "<div></body></html>";
    console.log(htmlSpoiler)
    return htmlSpoiler;

}

module.exports = {createNewRandomizedRom}
