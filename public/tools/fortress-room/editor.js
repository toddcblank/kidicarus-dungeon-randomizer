function placeMacro(x, y, macro) {
    room = document.getElementsByClassName("room")[0]
    macroElement = document.createElement('img')
    macroElement.src = "/images/fortresses/macros/" + macro.toString().padStart(2, "0") + '.png'
    macroElement.style = 'position: absolute; top:' +  (x * 16) + '; left:' + (y * 16) + ';'
    room.appendChild(macroElement)
}

function processsMap() {
    room = document.getElementsByClassName("room")[0]

    while (room.firstChild) {
        room.removeChild(room.firstChild);
    }

    text = document.getElementById("inputArea")
    lines = text.value.trim().split('\n')

    for (var i = 0; i < lines.length; i++){
        line = lines[i]
        if (line[0] == ';') {continue;}

        let pieces = line.trim().split(" ")
        if (pieces.length != 3) {
            continue;            
        }


        placeMacro(parseInt(pieces[0], 16), parseInt(pieces[1], 16), pieces[2])
    };
}