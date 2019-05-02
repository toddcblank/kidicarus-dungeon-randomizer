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
*/
function patchRom(patch, filename) {

    if (patch.constructor === Array) {
        console.log("Patch is actually " + patch.length + " patches, will recursively apply them")
        patch.forEach((p) => {
            patchRom(p, filename)
        })
        return;
    }
    console.log("patching at location " + patch.offset.toString("16"))
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

module.exports = {patchRom, copyOriginalRom}