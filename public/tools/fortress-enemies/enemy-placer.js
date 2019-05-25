let enemies = [
    "10", "20", 
    "30", "31", "32", "33", "34", "35", "36", "37", "38",
    "40", "41", "42", "43", "44", "45", "46", "47", "48",
    "60", "61", "62", "63"
];

let fortressRooms = [
    "01", "02", "03", "04", "05", "06", "07", "08", "09", "0a", "0b", "0c", "0d", "0e", "0f",
    "11", "12", "13", "14", "15", "16", "17", "18", "19", "1a", "1b", "1c", "1d", "1e", "1f",
    "20", "21", "22", "23", "24", "25", "26", "27", "28", "29"
];

function changeEnemy(amount) {
    let element = document.getElementById("enemyImage");
    var currIndex = parseInt(element.getAttribute("index"))
    currIndex += amount;

    if (currIndex < 0) {
        currIndex = enemies.length - 1;
    }

    if (currIndex >= enemies.length) {
        currIndex = 0;
    }

    element.src = "/images/enemies/" + enemies[currIndex] + ".png";
    element.setAttribute("index", currIndex);

    document.getElementById("enemyId").innerHTML = enemies[currIndex]
}

function changeRoom(amount) {
    let element = document.getElementById("roomImage");
    var currIndex = parseInt(element.getAttribute("index"))
    currIndex += amount;

    if (currIndex < 0) {
        currIndex = fortressRooms.length - 1;
    }

    if (currIndex >= fortressRooms.length) {
        currIndex = 0;
    }

    element.src = "/images/fortresses/" + fortressRooms[currIndex] + ".png";
    element.setAttribute("index", currIndex);
    document.getElementById("roomId").innerHTML = fortressRooms[currIndex]
}