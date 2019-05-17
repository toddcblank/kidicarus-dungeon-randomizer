let fs = require('fs')

function copyOriginalRom(originalName ='ki-orig.nes', newFilename) {
    console.log("copying " + originalName + " to " + newFilename)
    fs.copyFileSync(originalName, newFilename)
    fs.chmod(newFilename, 0666, (error) => {
        console.log('Changed permissions')
    })
}

/*
patch should be an object with:
{
    data: [], //byte array of the data to patch in
    offset: 0x0000, // address to patch from    
}

or an array of said objects (or an array of arrays of said objects, etc)
*/
function patchRom(patch, filename) {

    if (patch.constructor === Array) {
        console.log("Patch is actually " + patch.length + " patches, will recursively apply them")
        patch.forEach((p) => {
            patchRom(p, filename)
        })
        return;
    }
    console.log(patch.name + ": patching " + patch.data.length + " bytes at location 0x" + patch.offset.toString("16"))
    // console.log(patch)
    fs.open(filename, 'r+', function(status, fd) {
        if (status) {
            console.log("Status: " + status.message);
            return
        }
        // console.log(patches)
        decPatches = []
        if (typeof patch.data[0] == 'number') {
            decPatches = patch.data
        } else {
            patch.data.forEach((x) => {
                decPatches.push(parseInt(x, 16))
           })
        }
        var buffer = new Buffer.from(decPatches)
        fs.writeSync(fd, buffer, 0, decPatches.length, patch.offset);
    })
}

//Extracts patches from the romfile, will return 1 patch per level, plus a door patch, platform patch
function extractPatchesFromRom(filename) {

    //Not yet working...
    let patches= [
        {name: "world 1 fortress room data", length: 192, offset: 0x1b1b8},
        {name: "world 1 fortress centurion data", length: 3, offset: 0x1b2c4},
        {name: "world 2 fortress room data", length: 192, offset: 0x1b4ac},
        {name: "world 2 fortress centurion data", length: 3, offset: 0x1b5b8},
        {name: "world 3 fortress room data", length: 192, offset: 0x1b780},
        {name: "world 3 fortress centurion data", length: 3, offset: 0x1b88c},
        {name: "Stage 1-1", length: 24, offset: 0x1a56a},
        {name: "Stage 1-2", length: 28, offset: 0x1a584},
        {name: "Stage 1-3", length: 40, offset: 0x1a5a2},
        {name: "Enemy Table 1 for world 1", length: 47, offset: 0x1a626},
        {name: "Enemy Table 2 for world 1", length: 47, offset: 0x1a65b},
        {name: "Enemy Table 3 for world 1", length: 47, offset: 0x1a690},
        {name: "Enemy Table 4 for world 1", length: 47, offset: 0x1a6c5},
        {name: "world 1-1 item 1", length: 3, offset: 0x1a759},
        {name: "world 1-1 item 2", length: 3, offset: 0x1a75d},
        {name: "world 1-2 item 1", length: 3, offset: 0x1a761},
        {name: "world 1-2 item 2", length: 3, offset: 0x1a765},
        {name: "world 1-3 item 1", length: 3, offset: 0x1a769},
        {name: "world 1-3 item 2", length: 3, offset: 0x1a76d},
        {name: "world 1 platforms", length: 128, offset: 0x1a4b0},
        {name: "Stage 2-1", length: 54, offset: 0xbb3e},
        {name: "Stage 2-2", length: 60, offset: 0xbb76},
        {name: "Stage 2-3", length: 60, offset: 0xbbb4},
        {name: "Enemy Table 1 for world 2", length: 87, offset: 0xbc55},
        {name: "Enemy Table 2 for world 2", length: 87, offset: 0xbcb2},
        {name: "Enemy Table 3 for world 2", length: 87, offset: 0xbd0f},
        {name: "Enemy Table 4 for world 2", length: 87, offset: 0xbd6c},
        {name: "world 2 items", length: 7, offset: 0xbc3c},
        {name: "world 2 platforms", length: 128, offset: 0xbdc3},
        {name: "Stage 3-1", length: 22, offset: 0x1aef5},
        {name: "Stage 3-2", length: 28, offset: 0x1af0d},
        {name: "Stage 3-3", length: 32, offset: 0x1af2b},
        {name: "Enemy Table 1 for world 3", length: 52, offset: 0x1af87},
        {name: "Enemy Table 2 for world 3", length: 52, offset: 0x1afc1},
        {name: "Enemy Table 3 for world 3", length: 52, offset: 0x1affb},
        {name: "Enemy Table 4 for world 3", length: 52, offset: 0x1b035},
        {name: "world 3 items", length: 4, offset: 0x1b0cd},
        {name: "world 3 platforms", length: 128, offset: 0x1ae3b},
        {name: "Door Patch", length: 184, offset: 0x1efd9},
        {name: "Removes hidden score requirement from upgrade rooms", length: 7, offset: 0x18abe},
        {name: "Stage 4-1", length: 26, offset: 0xfeb6},
        {name: "Enemy Table 1 for world 4", length: 13, offset: 0xff0d},
        {name: "Enemy Table 2 for world 4", length: 13, offset: 0xff22},
        {name: "Invert Torch functionality", length: 1, offset: 0x1e27b},
        {name: "Invert Pencil functionality", length: 1, offset: 0x1524c},
        {name: "Invert Map functionality", length: 1, offset: 0x1e21b},
        {name: "Adds alphabet to title screen", length: 416, offset: 0x3d30},
        {name: "Line 1 of title text patch", length: 10, offset: 0x63c3},
        {name: "line 2 of title text patch", length: 10, offset: 0x63e3},
        {name: "line 3 of title text patch", length: 12, offset: 0x6402},
        {name: "line 4 of title text patch", length: 12, offset: 0x6422},
        {name: "Add seed name to title screen", length: 7, offset: 0x64c5},
        {name: "Adjusts shop prices", length: 24, offset: 0x1efb2}
    ]

    console.log("Extracting patches from " + filename)
    let extractedPatches = [];
    // console.log(patch)
    fs.open(filename, 'r', function(status, fd) {
        if (status) {
            return
        }
        console.log(patches)
        patches.forEach((patch) => {
            let buffer = Buffer.alloc(patch.length)
            fs.readFileSync(filename, buffer, patch.offset, patch.length, null)
            console.log(buffer)
            extractedPatches.push({
                name: patch.name,
                offset: patch.offset,
                data: [...buffer]
            })
        })
        console.log(JSON.stringify(extractedPatches, " "))
        return extractedPatches
    })
    
}

module.exports = {patchRom, copyOriginalRom, extractPatchesFromRom}

// extractPatchesFromRom("../../public/generated-seeds/ki-N3A214A.nes")
