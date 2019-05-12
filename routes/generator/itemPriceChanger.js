const CHALICE = 0x1efb2
const BOTTLE_SHOP = 0x1efb5 
const HAMMER = 0x1efb8
const FEATHER_SHOP = 0x1efbb
const TORCH = 0x1efbe
const PENCIL = 0x1efc1

const BOTTLE_BM = 0x1efc4 //1 bytes instead of 3, no haggling.
const BARREL_BM = 0x1efc5
const FEATHER_BM = 0x1efc6
const FIRE_BM = 0x1efc7
const BOW_BM = 0x1efc8
const SHIELD_BM = 0x1efc9


function getPricePatch() {
    return {
        name: "Adjusts shop prices",
        offset: CHALICE,
        data: [
            0x04, 0x02, 0x05,   //chalice
            0x10, 0x05, 0x20,   //bottle
            0x01, 0x01, 0x02,   //hammer
            0x12, 0x07, 0x20,   //feather
            0x99, 0x01, 0x01,   //torch
            0x99, 0x01, 0x01,   //pencil
            //Black Market
            0x15,               //bottle
            0x20,               //barrel
            0x17,               //feather
            0x01,               //fire
            0x02,               //bow
            0x03                //shield
        ]
    }
}

module.exports = {getPricePatch}