
function screenRules(previousScreen, nextScreen, world) {
    return screenRule[world][previousScreen][nextScreen];
}

//Screen rules
const screenRule = [[], [], [], [], []];
screenRule[0][0] =  []
screenRule[1][0] =  []
screenRule[2][0] =  []
screenRule[3][0] =  []
screenRule[4][0] =  []
//const SCREEN_NOT_ALLOWED = -1;
// const SCREEN_OKAY = 1;
// const SCREEN_AWESOME = 2;
// const SCREEN_UGLY = 3;
// const SCREEN_HARD = 4;
//                   0   1   2   3   4   5   6   7   8   9  10  11  12  13  14  15  16  17  18  19  20  21  22  23  24  25  26  27  28  29  30  31  32  33  34  35  36  37  38
screenRule[1][1] =  [0, -1,  1,  1, -1,  1,  1,  1, -1, -1,  1,  1,  1,  4,  1, -1,  4,  4, -1, -1,  1,  1,  1,  1,  1,  1,  1, -1, -1, -1, -1, -1, -1,  1,  4,  1, -1, -1, -1];
screenRule[1][2] =  [0,  1, -1,  1, -1, -1, -1,  4,  1, -1, -1,  1,  1,  1, -1,  1,  1,  1,  1,  1,  1, -1, -1, -1, -1, -1, -1,  3, -1, -1, -1, -1,  1, -1,  1,  1, -1, -1, -1];
screenRule[1][3] =  [0,  1,  4,  1,  1,  1, -1, -1,  1, -1,  1,  1,  1,  1,  1,  1,  1,  1, -1,  1,  1,  4,  1,  1,  1,  1,  1,  3, -1, -1, -1, -1,  4,  1, -1,  2,  1,  1,  1];
screenRule[1][4] =  [0,  2, -1,  1, -1,  1, -1,  1,  1,  4,  1,  1,  1,  1,  1,  1,  1,  1,  1, -1,  1, -1,  1,  2, -1,  1, -1,  1, -1, -1, -1, -1, -1, -1, -1,  1, -1, -1, -1];
screenRule[1][5] =  [0, -1, -1,  1, -1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  3,  1,  1,  1, -1,  1,  1,  1,  1, -1,  1, -1,  3, -1, -1, -1, -1, -1, -1, -1,  1,  1,  1,  1];
screenRule[1][6] =  [0,  1, -1,  1, -1,  1, -1,  1,  1, -1,  1,  1,  1,  1, -1,  1,  1,  1,  1,  1,  1, -1,  1, -1, -1,  1, -1,  1, -1, -1, -1, -1,  1, -1,  1,  1,  1,  1,  1];
screenRule[1][7] =  [0, -1, -1, -1, -1, -1, -1, -1,  1, -1, -1, -1, -1, -1, -1,  1, -1, -1, -1, -1, -1, -1, -1,  4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,  2, -1, -1, -1];
screenRule[1][8] =  [0,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1, -1, -1, -1, -1,  1,  4,  1,  1,  1,  1,  1];
screenRule[1][9] =  [0, -1, -1, -1, -1,  1,  1,  1,  1, -1,  4, -1,  1,  1,  1,  1,  4, -1,  4, -1,  1, -1,  1,  1, -1, -1, -1, -1, -1, -1, -1,  1, -1, -1, -1,  2,  1, -1, -1];
screenRule[1][10] = [0,  4, -1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1, -1, -1, -1, -1,  1, -1, -1,  2,  1, -1,  1];
screenRule[1][11] = [0,  1, -1,  1,  1,  1, -1, -1,  1, -1,  1,  1,  1,  1,  1,  1,  1,  1, -1,  1,  1, -1,  1,  1,  1,  1, -1,  3, -1, -1, -1, -1,  1, -1,  1, -1,  1, -1, -1];
screenRule[1][12] = [0,  1, -1,  1, -1,  1, -1, -1,  1, -1,  1,  1,  1,  1, -1,  1,  1,  1,  1,  1,  1, -1,  1,  4,  1,  1,  1, -1, -1, -1, -1, -1, -1,  1,  4,  1,  1,  1,  1];
screenRule[1][13] = [0,  1, -1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1, -1,  1, -1,  1,  1,  4,  1, -1,  1, -1, -1, -1,  1,  1, -1, -1,  2,  1,  1,  1];
screenRule[1][14] = [0,  1, -1,  1,  1,  1, -1, -1,  1,  4,  1,  1,  1,  1, -1,  1,  1,  1,  1,  1,  1, -1,  4,  1, -1,  4, -1,  4, -1, -1, -1, -1,  1, -1,  1,  2,  1,  1,  1];
screenRule[1][15] = [0,  1, -1,  1,  1,  1,  4, -1,  1, -1,  1,  1,  1,  1,  1,  1,  1,  1, -1,  1,  1, -1,  1,  1,  1,  1, -1,  3, -1, -1, -1, -1,  1, -1,  1, -1,  1,  1,  1];
screenRule[1][16] = [0,  4,  1,  1,  4,  4, -1, -1, -1, -1,  1,  4,  1, -1,  1,  1,  1,  1, -1, -1,  1,  4,  1,  1,  4,  1,  4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,  1,  1];
screenRule[1][17] = [0, -1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  3, -1, -1, -1, -1, -1,  4,  4,  2,  1, -1,  1];
screenRule[1][18] = [0,  4, -1,  1,  1, -1, -1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1, -1,  1,  1, -1,  1, -1,  3, -1, -1, -1, -1,  1, -1, -1,  2,  1,  1,  1];
screenRule[1][19] = [0,  4, -1, -1,  1, -1, -1, -1,  1, -1, -1, -1, -1, -1, -1,  1, -1, -1, -1,  1,  1, -1, -1,  1, -1, -1, -1,  4, -1, -1, -1, -1,  1, -1, -1, -1, -1, -1, -1];
screenRule[1][20] = [0, -1,  4,  1,  4,  1,  1,  1, -1, -1,  1,  1,  1,  4,  1, -1, -1, -1,  4, -1,  1,  1,  1,  1,  1,  1,  1, -1, -1, -1, -1, -1, -1,  4, -1, -1,  1,  1,  1];
screenRule[1][21] = [0, -1, -1,  1, -1,  1,  4,  1, -1, -1,  1,  1,  1,  4,  1, -1,  1,  1, -1,  4,  1,  1,  1,  1,  1,  1,  4,  2, -1, -1, -1, -1, -1, -1,  4, -1,  1, -1,  1];
screenRule[1][22] = [0,  1,  4,  1,  1,  1, -1,  4,  1, -1,  1,  1,  1, -1,  1,  1,  4,  4, -1,  1,  1,  1,  1,  1,  3,  1,  1,  4, -1, -1, -1, -1,  1,  1,  4, -1,  1,  1, -1];
screenRule[1][23] = [0, -1,  4,  1, -1,  1,  1,  1,  1,  1,  1, -1,  1,  1,  1,  3,  1,  1,  1, -1,  1, -1,  1,  1, -1,  4, -1,  3, -1, -1, -1, -1, -1, -1, -1, -1,  4,  1, -1];
screenRule[1][24] = [0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,  1, -1, -1, -1, -1,  1, -1, -1, -1, -1, -1, -1, -1, -1,  4,  1, -1, -1, -1, -1];
screenRule[1][25] = [0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,  1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,  1, -1];
screenRule[1][26] = [0,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1, -1, -1, -1, -1,  1, -1,  1,  1,  1, -1,  1];
screenRule[1][27] = [0, -1, -1,  1, -1, -1, -1,  1,  1,  1, -1, -1,  1,  1,  1,  3,  1,  1,  1, -1,  1, -1,  1,  1,  1, -1,  1, -1, -1, -1, -1, -1, -1,  1,  4, -1,  1, -1,  1];
screenRule[1][28] = [0,  1, -1,  1,  2, -1, -1,  1,  1,  4,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1, -1,  1,  2, -1,  4, -1,  3, -1, -1, -1, -1, -1,  4, -1,  1, -1, -1, -1];
screenRule[1][29] = [0,  4, -1,  1, -1,  1,  1,  1,  1, -1,  1, -1,  1,  1,  1,  3,  1,  1,  1, -1,  1, -1,  1,  1, -1,  1, -1,  3, -1, -1, -1, -1, -1, -1, -1, -1,  1, -1, -1];
screenRule[1][30] = [0, -1,  1,  1, -1, -1, -1,  1,  1, -1,  1,  1,  1,  1,  1,  1,  4,  4,  1, -1,  1,  1,  1,  1, -1,  1, -1,  3, -1, -1, -1, -1, -1, -1, -1, -1,  1, -1, -1];
screenRule[1][31] = [0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
screenRule[1][32] = [0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
screenRule[1][33] = [0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
screenRule[1][34] = [0, -1,  1,  1,  1,  1,  1,  1,  1, -1,  1,  1,  1,  1,  1,  3,  1,  4,  1,  1,  1,  1,  1,  1,  1,  4,  1,  3, -1, -1, -1, -1, -1, -1,  1, -1,  1, -1, -1];
screenRule[1][35] = [0,  1, -1,  2,  1,  1,  1,  4,  1,  2,  4,  2,  2,  2, -1,  1,  2,  2,  2,  3,  4, -1, -1,  3,  3, -1, -1,  4, -1, -1, -1,  3,  1, -1, -1,  1, -1, -1, -1];
screenRule[1][36] = [0, -1, -1,  1, -1, -1,  1,  1,  1,  1,  1, -1,  1,  1,  1,  1,  1,  1,  1, -1,  1,  1,  1,  1, -1, -1, -1,  1, -1, -1, -1, -1, -1, -1, -1, -1,  1,  1,  1];
screenRule[1][37] = [0, -1, -1,  1, -1,  1,  1,  1,  1, -1,  1, -1,  1,  1,  1,  1,  1, -1,  1, -1,  1, -1,  1,  1, -1,  1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,  1,  1,  1];
screenRule[1][38] = [0, -1, -1, -1, -1,  1,  1,  1, -1, -1, -1, -1,  1,  2,  1, -1, -1, -1, -1, -1,  1, -1,  1,  1, -1, -1,  1,  1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];

//                   0   1   2   3   4   5   6   7   8   9  10  11  12  13  14  15  16  17  18  19  20  21  22  23  24  25  26  27  28  29  30  31  32  33  34  35  36  37  38  39  40  41
screenRule[2][1] =  [0, 1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  3,  3,  3,  3, -1,  3,  1,  1,  1,  1,  1,  1,  1,  1,  3, -1, -1, -1,  1,  3,  3,  1,  1,  1];
screenRule[2][2] =  [0, 1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  3,  3,  3,  3,  1,  3,  1,  1,  1,  1,  1,  1,  1,  1,  3, -1, -1, -1,  1,  3,  3,  1,  1,  1];
screenRule[2][3] =  [0, 1,  1,  1,  1,  1,  1,  1,  1,  1,  4,  4,  3, -1, -1,  3,  3,  2,  3,  3,  3,  3,  3,  3,  1,  1,  1,  1,  1,  1,  3,  1,  3, -1, -1, -1,  1,  3,  3,  1,  1,  1];
screenRule[2][4] =  [0, 1,  3,  1,  1,  1,  3,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  3,  1,  1,  1,  1,  1,  1, -1, -1, -1,  1,  1,  1,  1,  1,  1];
screenRule[2][5] =  [0, 1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  2,  3,  3,  3,  3, -1,  3,  1,  1,  1,  1,  1,  1,  1,  1,  3, -1, -1, -1,  1,  3,  3,  1,  1,  1];
screenRule[2][6] =  [0, 1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1, -1,  2,  3,  3,  3,  3, -1,  3,  1,  1,  1,  1,  1,  1,  1,  1,  3, -1, -1, -1,  1,  3,  3,  1,  1,  1];
screenRule[2][7] =  [0, 1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  2,  3,  3,  3,  3, -1,  3,  1,  1,  1,  1,  1,  1,  1,  1,  3, -1, -1, -1,  1,  3,  3,  1,  1,  1];
screenRule[2][8] =  [0, 1,  3,  1,  1,  1,  3,  1,  1,  1,  1,  1,  1,  1,  1,  1,  2,  1,  1,  1,  1,  1,  1,  1,  1,  1,  3,  1,  1,  1,  1,  1,  1, -1, -1, -1,  1,  1,  1,  1,  1,  1];
screenRule[2][9] =  [0, 1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1, -1, -1, -1,  1,  1,  1,  1,  1,  1];
screenRule[2][10] = [0, 1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  3,  3,  3,  3, -1,  3,  1,  1,  1,  1,  2,  2,  1,  1,  3, -1, -1, -1,  1,  3,  3,  1,  1,  1];
screenRule[2][11] = [0, 1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1, -1, -1, -1,  1,  1,  1,  1,  1,  1];
screenRule[2][12] = [0, 3,  3,  3,  3,  1,  3,  3,  3,  3,  1,  1,  1,  1,  1,  1,  1,  1,  3,  3,  3,  3, -1,  3,  3,  3,  3,  3,  3,  3,  1,  3,  3, -1, -1, -1,  1,  3,  3,  1,  1,  1];
screenRule[2][13] = [0, 1,  1,  1,  1,  1,  1,  2,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  3,  3,  3,  3, -1,  3,  1,  1,  1,  2,  1,  1,  1,  1,  3, -1, -1, -1,  1,  3,  3,  1,  1,  1];
screenRule[2][14] = [0, 1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  3,  3,  3,  3, -1,  3,  1,  1,  1,  1,  1,  1,  1,  1,  3, -1, -1, -1,  1,  1,  3,  1,  1,  1];
screenRule[2][15] = [0, 1,  1,  1,  1,  3,  1,  1,  1,  1,  3,  3,  1,  2,  1,  1,  1,  1,  1,  1,  1,  1,  1,  3,  1,  1,  1,  1,  1,  1,  2,  2,  2, -1, -1, -1,  1,  1,  3,  1,  1,  1];
screenRule[2][16] = [0, 1,  1,  1,  1,  3,  1,  1,  1,  1,  3,  3,  1,  2,  2,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1, -1, -1, -1,  1,  2,  3,  1,  1,  1];
screenRule[2][17] = [0, 3,  3,  1,  3,  3,  3,  3,  3,  3,  3,  3,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  3,  3,  3,  3,  1,  3,  1,  3,  1, -1, -1, -1,  3,  1,  3,  1,  1,  1];
screenRule[2][18] = [0, 1,  1,  1,  1,  3,  1,  1,  1,  1,  3,  3,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1, -1, -1, -1,  3,  1,  3,  1,  1,  1];
screenRule[2][19] = [0, 1,  3,  1,  1,  3,  1,  1,  1,  1,  3,  3,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1, -1, -1, -1,  3,  1,  3,  1,  1,  1];
screenRule[2][20] = [0, 1,  1,  1,  1,  3,  1,  1,  1,  1,  3,  3,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1, -1, -1, -1,  3,  1,  3,  1,  1,  1];
screenRule[2][21] = [0, 1,  1,  1,  1,  3,  2,  1,  1,  1,  3,  3,  1,  2,  2,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1, -1, -1, -1,  1,  1,  3,  1,  1,  1];
screenRule[2][22] = [0, 3,  3,  1,  3,  3,  3,  3,  3,  3,  3,  3,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  3,  3,  3,  3,  1,  3,  1,  3,  1, -1, -1, -1,  3,  1,  3,  1,  1,  1];
screenRule[2][23] = [0, 1,  1,  1,  1,  3,  1,  1,  1,  1,  2,  2,  1,  2,  2,  1,  1,  2,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  2, -1, -1, -1,  1,  1,  3,  1,  1,  1];
screenRule[2][24] = [0, 1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  3,  3,  3,  3, -1,  3,  1,  1,  1,  1,  1,  1,  1,  1,  3, -1, -1, -1,  1,  3,  1,  1,  1,  1];
screenRule[2][25] = [0, 1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  3,  3,  3,  3, -1,  3,  1,  1,  1,  1,  1,  1,  1,  1,  3, -1, -1, -1,  1,  3,  1,  1,  1,  1];
screenRule[2][26] = [0, 1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  2,  1,  3,  3,  3,  1,  1,  3,  1,  1,  1,  1,  1,  1,  1,  1,  3, -1, -1, -1,  3,  3,  1,  1,  1,  1];
screenRule[2][27] = [0, 1,  1,  1,  1,  1,  1,  2,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  3,  1,  1,  1,  2,  1,  1,  1,  1,  1,  1, -1, -1, -1, -1,  1,  2,  1,  1,  1];
screenRule[2][28] = [0, 1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  2,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1, -1, -1, -1, -1,  1,  2,  1,  1,  1];
screenRule[2][29] = [0, 1,  1,  1,  1,  3,  1,  1,  1,  1,  3,  3,  1,  2,  2,  1,  1,  2,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  2, -1, -1, -1,  1,  2,  3,  1,  1,  1];
screenRule[2][30] = [0, 1,  1,  1,  1,  1,  1,  2,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  3,  1,  1,  1,  2,  1,  2,  1,  1,  3, -1, -1, -1, -1,  1,  1,  1,  1,  1];
screenRule[2][31] = [0, 1,  1,  1,  1,  3,  1,  1,  1,  1,  3,  3,  1,  2,  2,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1, -1, -1, -1,  1,  1,  3,  1,  1,  1];
screenRule[2][32] = [0, 3,  3,  1,  3,  4,  3,  3,  3,  3,  4,  4, -1, -1, -1, -1,  3, -1,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3,  1,  3,  3,  2,  3, -1, -1, -1,  3,  3,  2,  4,  1,  1];
screenRule[2][33] = [0, 1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  3,  3,  3,  3, -1,  3,  1,  1,  1,  1,  1,  1,  1,  1,  3, -1, -1, -1,  1,  3,  3,  1,  1,  1];
screenRule[2][34] = [0, 3,  3,  3,  3,  1,  3,  3,  3,  3,  1,  1,  1,  1,  1,  1,  1,  1,  3,  3,  3,  3, -1,  3,  3,  3,  3,  3,  3,  3,  1,  3,  3, -1, -1, -1,  1,  3,  3,  1,  1,  1];
screenRule[2][35] = [0, 1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  3,  3,  3,  3, -1,  3,  1,  1,  1,  1,  1,  1,  1,  1,  3, -1, -1, -1,  3,  1,  2,  1,  1,  1];
screenRule[2][36] = [0, 1, -1, -1, -1,  4, -1, -1, -1, -1,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4,  4, -1, -1, -1, -1, -1, -1,  4, -1, -1, -1, -1, -1,  4,  4, -1,  1,  1,  1];
screenRule[2][37] = [0, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,  1,  1,  1];
screenRule[2][38] = [0, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,  1,  1,  1];
//                   0   1   2   3   4   5   6   7   8   9  10  11  12  13  14  15  16  17  18  19  20  21  22  23  24  25  26  27  28  29  30  31  32  33  34  35  36  37  38  39  40  41
screenRule[2][39] = [0, 1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1, -1, -1, -1,  1,  1,  1,  1,  1,  1];
screenRule[2][40] = [0, 1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1, -1, -1, -1,  1,  1,  1,  1,  1,  1];
screenRule[2][41] = [0, 1,  1,  1,  1,  1,  1,  1,  1,  1,  4,  1,  1,  4,  4,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1, -1, -1, -1,  1,  1,  1,  1,  1,  1];



//                   0   1   2   3  *4   5   6   7   8   9  10  11  12  13  14  15  16  17  18  19
screenRule[3][1] =  [0,  1,  1,  1, -1, -1, -1, -1,  1,  1, -1, -1, -1, -1,  1, -1,  1, -1, -1, -1];
screenRule[3][2] =  [0,  1,  1, -1,  1,  4, -1, -1,  1,  1,  1, -1, -1,  1,  4, -1,  1,  1,  1,  1];
screenRule[3][3] =  [0,  1,  1,  1, -1, -1, -1, -1,  1,  1, -1, -1, -1, -1,  1, -1,  1, -1, -1, -1];
screenRule[3][4] =  [0,  1,  1, -1,  1,  1, -1,  4,  1,  1,  1,  1,  4,  1,  1,  1,  1,  1,  1,  1];
screenRule[3][5] =  [0,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1, -1,  1,  1,  1,  1,  1,  1,  1];
screenRule[3][6] =  [0,  1,  1, -1,  4,  1, -1,  1,  1,  1,  1,  1, -1,  1,  1,  1,  1,  1,  1,  1];
screenRule[3][7] =  [0,  1,  1,  1,  1,  4,  1, -1,  1,  1,  1,  1, -1,  1,  4, -1,  1,  1,  1,  1];
screenRule[3][8] =  [0,  1,  1,  1, -1, -1,  1,  1,  1,  1,  1,  1, -1,  1,  1,  1,  1,  1,  1,  1];
screenRule[3][9] =  [0,  1,  1,  1, -1,  4,  1,  4,  1,  1,  1,  1, -1,  1,  1,  1,  1,  1,  1,  1];
screenRule[3][10] = [0,  1,  1,  1, -1,  4, -1, -1,  1,  1, -1,  1, -1,  1,  1,  1,  1,  1, -1, -1];
screenRule[3][11] = [0,  1, -1, -1, -1, -1, -1, -1, -1,  1, -1,  1,  4,  1, -1, -1,  1,  1, -1, -1];
screenRule[3][12] = [0,  1,  1,  1, -1,  1, -1,  1,  1,  1,  1,  1, -1,  1,  1,  1,  1,  1,  1,  1];
screenRule[3][13] = [0,  1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
screenRule[3][14] = [0,  1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
screenRule[3][15] = [0,  1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];

screenRule[3][16] = [0,  1, -1,  1,  1, -1, -1, -1,  1,  1,  1, -1, -1,  1,  1,  1,  1,  4,  1,  1];
screenRule[3][17] = [0,  4, -1, -1,  1, -1,  1, -1, -1,  1, -1,  1, -1, -1,  1, -1,  1,  1, -1, -1];
screenRule[3][18] = [0,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  4,  1,  1,  1,  1,  1,  1,  1];
screenRule[3][19] = [0,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  4,  1,  1,  1,  1,  1,  1,  1];



screenRule[4][1] = [0, 3,  1,  1,  1,  1,  1, -1];
screenRule[4][2] = [0, 3,  1,  1,  1,  1,  1, -1];
screenRule[4][3] = [0, 1,  1,  1,  1,  1,  2, -1];
screenRule[4][4] = [0, 1,  1,  1,  1,  1,  1, -1];
screenRule[4][5] = [0, 3,  1,  1,  1,  1,  1, -1];
screenRule[4][6] = [0, 3,  1,  2,  1,  1,  1, -1];
screenRule[4][7] = [0, 3,  1,  1,  1,  1,  1, -1];

screensByWorldAndAddress = []
screensByWorldAndAddress[0] = []
screensByWorldAndAddress[1] = []
screensByWorldAndAddress[2] = []
screensByWorldAndAddress[3] = []
screens = [
    [], //world 0 no-existo
    [
        {id:00, address1: 0x00, address2: 0x00, door: 0x0,  item: 0x00},
        {id:01, address1: 0x0b, address2: 0x71, door: 0xae, item: 0x9A},
        {id:02, address1: 0x3e, address2: 0x71, door: 0x74, item: 0x9A},
        {id:03, address1: 0x80, address2: 0x71, door: 0x4b, item: 0x99},
        {id:04, address1: 0xa4, address2: 0x71, door: 0x93, item: 0xC5},
        {id:05, address1: 0xec, address2: 0x71, door: 0x73, item: 0x3A},
        {id:06, address1: 0x3a, address2: 0x72, door: 0xab, item: 0x98},
        {id:07, address1: 0x73, address2: 0x72, door: 0x75, item: 0x6A},
        {id:08, address1: 0xa3, address2: 0x72, door: 0x55, item: 0x98},
        {id:09, address1: 0xd3, address2: 0x72, door: 0xa9, item: 0x9A},
        {id:10, address1: 0x4b, address2: 0x73, door: 0x71, item: 0x9A},
        {id:11, address1: 0x81, address2: 0x73, door: 0x74, item: 0x98},
        {id:12, address1: 0xa5, address2: 0x73, door: 0x2e, item: 0x96},
        {id:13, address1: 0xcf, address2: 0x73, door: 0x99, item: 0x9D},
        {id:14, address1: 0xf9, address2: 0x73, door: 0x64, item: 0x9B},
        {id:15, address1: 0x23, address2: 0x74, door: 0xb1, item: 0xA3},
        {id:16, address1: 0x56, address2: 0x74, door: 0xa7, item: 0x97},
        {id:17, address1: 0x7d, address2: 0x74, door: 0x4c, item: 0x97},
        {id:18, address1: 0xf8, address2: 0x74, door: 0x2c, item: 0x9B},
        {id:19, address1: 0x76, address2: 0x75, door: 0x8e, item: 0x84},
        {id:20, address1: 0x97, address2: 0x75, door: 0x51, item: 0xAA},
        {id:21, address1: 0xc4, address2: 0x75, door: 0x43, item: 0x92},
        {id:22, address1: 0x0c, address2: 0x76, door: 0x55, item: 0x9B},
        {id:23, address1: 0x39, address2: 0x76, door: 0x00, item: 0xA4},
        {id:24, address1: 0xb1, address2: 0x76, door: 0x9e, item: 0x96},
        {id:25, address1: 0x17, address2: 0x77, door: 0x0,  item: 0x9A, platforms: [
            {location: 0x07, offset: 0}]
        },
        {id:26, address1: 0x4d, address2: 0x77, door: 0x46, item: 0x95},
        {id:27, address1: 0x8c, address2: 0x77, door: 0x41, item: 0xAB},
        {id:28, address1: 0xbd, address2: 0x70, door: 0x9d, item: 0x9B},
        {id:29, address1: 0x09, address2: 0x73, door: 0x9e, item: 0x97},
        {id:30, address1: 0x2e, address2: 0x75, door: 0x9d, item: 0x86},
        {id:31, address1: 0x00, address2: 0x70, door: 0x96, item: 0x93},
        {id:32, address1: 0x39, address2: 0x70, door: 0xb1, item: 0xA4},
        {id:33, address1: 0x78, address2: 0x70, door: 0x76, item: 0xB3},
        {id:34, address1: 0xdb, address2: 0x76, door: 0x92, item: 0xB9},
        {id:35, address1: 0xa4, address2: 0x74, door: 0x0,  item: 0xAA, platforms: [
            {location: 0xC7, offset: 0},
            {location: 0x97, offset: 0},
            {location: 0x67, offset: 0},
            {location: 0x37, offset: 0},
        ]},
        {id:36, address1: 0xc5, address2: 0x74, door: 0x0,  item: 0x95, platforms: [
            {location: 0xC7, offset: 0},
            {location: 0x67, offset: 0}]
        },
        {id:37, address1: 0xe0, address2: 0x74, door: 0x0,  item: 0x95, platforms: [
            {location: 0xC7, offset: 0},
            {location: 0x37, offset: 0}]
        },
        {id:38, address1: 0x81, address2: 0x76, door: 0x0,  item: 0x69, platforms: [
            {location: 0xC7, offset: 0},
            {location: 0x97, offset: 0},
            {location: 0x37, offset: 0}]
        },
            
            
    ],
    [
        {id:00, address1: 0x00, address2: 0x00, door: 0x0, item: 0x00},
        {id:01, address1: 0x1B, address2: 0xB1, door: 0xa3, item: 0x92},
        {id:02, address1: 0x3F, address2: 0xB1, door: 0xaa, item: 0x63},
        {id:03, address1: 0x63, address2: 0xB1, door: 0xab, item: 0x95},
        {id:04, address1: 0x8D, address2: 0xB1, door: 0xa4, item: 0x92},
        {id:05, address1: 0xBD, address2: 0xB1, door: 0xa9, item: 0x94},
        {id:06, address1: 0xD5, address2: 0xB1, door: 0x76, item: 0x52},
        {id:07, address1: 0x08, address2: 0xB2, door: 0xad, item: 0x9A},
        {id:08, address1: 0x3E, address2: 0xB2, door: 0xa8, item: 0x83},
        {id:09, address1: 0x65, address2: 0xB2, door: 0xa5, item: 0x92},
        {id:10, address1: 0x89, address2: 0xB2, door: 0x1e, item: 0x94},
        {id:11, address1: 0xB3, address2: 0xB2, door: 0xae, item: 0x76},
        {id:12, address1: 0x0A, address2: 0xB3, door: 0xaa, item: 0x84},
        {id:13, address1: 0x28, address2: 0xB3, door: 0x6a, item: 0x66},
        {id:14, address1: 0x52, address2: 0xB3, door: 0xaa, item: 0x97},
        {id:15, address1: 0x7C, address2: 0xB3, door: 0x89, item: 0x82},
        {id:16, address1: 0xAC, address2: 0xB3, door: 0x68, item: 0x74},
        {id:17, address1: 0xD0, address2: 0xB3, door: 0x8a, item: 0x54},
        {id:18, address1: 0xEE, address2: 0xB3, door: 0x87, item: 0x52},
        {id:19, address1: 0x1E, address2: 0xB4, door: 0x7c, item: 0x75},
        {id:20, address1: 0x45, address2: 0xB4, door: 0x9a, item: 0x83},
        {id:21, address1: 0x78, address2: 0xB4, door: 0x5a, item: 0x42},
        {id:22, address1: 0xB7, address2: 0xB4, door: 0x9c, item: 0x56},
        {id:23, address1: 0xDB, address2: 0xB4, door: 0x96, item: 0x85},
        {id:24, address1: 0x3E, address2: 0xB5, door: 0xaa, item: 0x86},
        {id:25, address1: 0x62, address2: 0xB5, door: 0xa8, item: 0x82},
        {id:26, address1: 0xB0, address2: 0xB5, door: 0x2b, item: 0x46},
        {id:27, address1: 0x0A, address2: 0xB6, door: 0x00, item: 0x92},
        {id:28, address1: 0x43, address2: 0xB6, door: 0x9e, item: 0x75},
        {id:29, address1: 0x9D, address2: 0xB6, door: 0xa6, item: 0x92},
        {id:30, address1: 0xCD, address2: 0xB6, door: 0x4b, item: 0x65},
        {id:31, address1: 0x00, address2: 0xB7, door: 0xa5, item: 0x82},
        {id:32, address1: 0x27, address2: 0xB7, door: 0x9a, item: 0x76},
        {id:33, address1: 0xE5, address2: 0xB0, door: 0xaa, item: 0x97},
        {id:34, address1: 0xD4, address2: 0xB2, door: 0xa5, item: 0x98},
        {id:35, address1: 0x05, address2: 0xB5, door: 0xa8, item: 0x99},
        {id:36, address1: 0x3A, address2: 0xB0, door: 0x0, item: 0x48}, //end of stage
        {id:37, address1: 0x70, address2: 0xB0, door: 0x0, item: 0x5B}, //end of stage
        {id:38, address1: 0xAC, address2: 0xB0, door: 0x0, item: 0x85}, //end of stage

        {id:39, address1: 0xa5, address2: 0xb4, door:0x0, item: 0x48, platforms: [
            {location: 0x26, offset: 0},
            {location: 0x76, offset: 0},
            {location: 0xb6, offset: 0}]
        },
        {id:40, address1: 0x6d, address2: 0xb6, door:0x0, item: 0x81, platforms: [            
            {location: 0xB6, offset: 0}
            ]
        },
        {id:41, address1: 0x86, address2: 0xb5, door:0x0, item: 0x36, platforms: [
            {location: 0x46, offset: 0},
            {location: 0xC6, offset: 0}]
        },
    ],
    [
        {id:00, address1: 0x00, address2: 0x00, door: 0x0, item: 0x00},
        {id:01, address1: 0xf3, address2: 0x70, door: 0x64, item: 0xB7},
        {id:02, address1: 0x0e, address2: 0x71, door: 0x0, item: 0x59},
        {id:03, address1: 0x4d, address2: 0x71, door: 0xab, item: 0x9A},
        {id:04, address1: 0x86, address2: 0x71, door: 0x16, item: 0xB8, platforms: [
            {location: 0xe7, offset: 0}]},
        {id:05, address1: 0xad, address2: 0x71, door: 0x7c, item: 0x67},
        {id:06, address1: 0x16, address2: 0x72, door: 0x88, item: 0x8A},
        {id:07, address1: 0x46, address2: 0x72, door: 0x88, item: 0x86},
        {id:08, address1: 0xaf, address2: 0x72, door: 0x9c, item: 0x8A},
        {id:09, address1: 0x06, address2: 0x73, door: 0x78, item: 0x9B},
        {id:10, address1: 0x3f, address2: 0x73, door: 0x5e, item: 0x96}, 
        {id:11, address1: 0xb7, address2: 0x70, door: 0xbe, item: 0xAD},
        {id:12, address1: 0x79, address2: 0x72, door: 0x5f, item: 0x86},
        {id:13, address1: 0x00, address2: 0x70, door: 0x9a, item: 0xA7},
        {id:14, address1: 0x2d, address2: 0x70, door: 0x9a, item: 0xB2},
        {id:15, address1: 0x66, address2: 0x70, door: 0xaa, item: 0xA4},        

        {id:16, address1: 0x2f, address2: 0x71, door: 0x0, item: 0x85, platforms: [
            {location: 0xb7, offset: 0}]},        
        {id:17, address1: 0xda, address2: 0x71, door: 0x0, item: 0x5B, platforms: [
            {location: 0x77, offset: 0},
            {location: 0xd7, offset: 0}]},        
        {id:18, address1: 0xf8, address2: 0x71, door: 0x0, item: 0x6C, platforms: [
            {location: 0xC7, offset: 0},
            {location: 0x97, offset: 0},
            {location: 0x37, offset: 0},
            {location: 0x07, offset: 0}]},        
        {id:19, address1: 0xdc, address2: 0x72, door: 0x0, item: 0x97, platforms: [
            {location: 0x07, offset: 0}]}
    ],
    [
        {id:00, address1: 0x00, address2: 0x00, door: 0x0},
        {id:01, address1: 0xee, address2: 0xba, door: 0x0},
        {id:02, address1: 0x1e, address2: 0xbb, door: 0x0},
        {id:03, address1: 0x51, address2: 0xbb, door: 0x0},
        {id:04, address1: 0x78, address2: 0xbb, door: 0x0},
        {id:05, address1: 0xab, address2: 0xbb, door: 0x0},
        {id:06, address1: 0x7c, address2: 0xba, door: 0x0},
        {id:07, address1: 0xaf, address2: 0xba, door: 0x0}
    ]
]

for (var i = 1; i <= 3; i++){
    screensForWorld = screens[i];
    for(var s = 0; s < screensForWorld.length; s++) {
        scr = screensForWorld[s];
        let key = ((scr.address2 << 8) + scr.address1).toString(16)
        screensByWorldAndAddress[i][key] = scr
    }
}

//w1 enemies
let ENEMY_NONE = 0x0;           //empty
let ENEMY_MONOEYE = 0x08;       //medium flying enemy
let ENEMY_NETTLER = 0x05;       //frogs
let ENEMY_COMMYLOOSE = 0x0A;    //octopus
let ENEMY_SHEMUN = 0x02;        //snakes
let ENEMY_MCGOO = 0x03;         //slime
let ENEMY_REAPER = 0x0D;        //reaper

//w2 enemies
let ENEMY_MICKS = 0x08;         //Flying mouths
let ENEMY_MINOS = 0x0A;         //Rising faces
let ENEMY_ROKMAN = 0x04;        //Rocks.  :eyeroll:
let ENEMY_KERON = 0x05;         //Frogs
let ENEMY_GIRIN = 0x03;         //Ground enemy
let ENEMY_SNOWMAN = 0x09;       //Snowman
let ENEMY_PLUTON = 0x07;        //Pluton (thief)

//w3 enemies
let ENEMY_KOMAYTO = 0x08;       //Metroid <3
let ENEMY_KEEPAH = 0x0C;        //Ridley
let ENEMY_COLLIN = 0x0B;        //Patra
let ENEMY_OCTOS = 0x0A;         //Octopus
let ENEMY_HOLER = 0x03;         //Slime
let ENEMY_PLUTONFLY = 0x07;     //Pluton Fly (thief)

//w4 enemies
let ENEMY_TOTEM = 0x04;
let ENEMY_MOILA = 0x06;
let ENEMY_SYREN = 0x08;
let ENEMY_DAPHNE = 0x0A;
let ENEMY_ZUREE = 0x07;
let ENEMY_ERINUS = 0x09;

const ENEMY_TABLE1 = [
    [
        //WORLD0
    ],[
        //WORLD1
        [
            //1-undefined diff
            ENEMY_NONE
        ],[
            //EASY
            ENEMY_MONOEYE,
            ENEMY_MONOEYE,
            ENEMY_MONOEYE,
            ENEMY_NETTLER,
            ENEMY_COMMYLOOSE,
            ENEMY_NONE,
            ENEMY_NONE,
            ENEMY_NONE,
            ENEMY_NONE,
            ENEMY_NONE
        ],[
            //NORMAL
            ENEMY_MONOEYE,
            ENEMY_MONOEYE,
            ENEMY_MONOEYE,
            ENEMY_NETTLER,
            ENEMY_NETTLER,
            ENEMY_COMMYLOOSE,
            ENEMY_COMMYLOOSE,
            ENEMY_NONE,
            ENEMY_NONE,
            ENEMY_NONE
        ],[
            //HARD
            ENEMY_MONOEYE,
            ENEMY_MONOEYE,
            ENEMY_MONOEYE,
            ENEMY_MONOEYE,
            ENEMY_NETTLER,
            ENEMY_NETTLER,
            ENEMY_COMMYLOOSE,
            ENEMY_COMMYLOOSE,
            ENEMY_COMMYLOOSE,
            ENEMY_NONE
        ]
    ],[
        //WORLD2
        [ENEMY_NONE],[
            ENEMY_MICKS,
            ENEMY_MICKS,
            ENEMY_MINOS,
            ENEMY_MINOS,
            ENEMY_ROKMAN,
            ENEMY_KERON,
            ENEMY_NONE,
            ENEMY_NONE,
            ENEMY_NONE,
            ENEMY_NONE,
        ],[
            ENEMY_MICKS,
            ENEMY_MICKS,
            ENEMY_MINOS,
            ENEMY_MINOS,
            ENEMY_ROKMAN,
            ENEMY_ROKMAN,
            ENEMY_KERON,
            ENEMY_NONE,
            ENEMY_NONE
        ],[
            ENEMY_MICKS,
            ENEMY_MICKS,
            ENEMY_MINOS,
            ENEMY_MINOS,
            ENEMY_MINOS,
            ENEMY_ROKMAN,
            ENEMY_ROKMAN,
            ENEMY_KERON,
            ENEMY_KERON
        ]
    ],[
        //WORLD3
        [ENEMY_NONE],[
            ENEMY_KOMAYTO,
            ENEMY_KOMAYTO,
            ENEMY_COLLIN,
            ENEMY_OCTOS,
            ENEMY_NONE,
            ENEMY_NONE,
            ENEMY_NONE,
            ENEMY_NONE,
            ENEMY_NONE,
            ENEMY_NONE            
        ],[            
            ENEMY_KOMAYTO,
            ENEMY_KOMAYTO,
            ENEMY_KOMAYTO,
            ENEMY_COLLIN,
            ENEMY_COLLIN,
            ENEMY_OCTOS,
            ENEMY_OCTOS,
            ENEMY_NONE,
            ENEMY_NONE            
        ],[            
            ENEMY_KOMAYTO,
            ENEMY_KOMAYTO,
            ENEMY_KOMAYTO,
            ENEMY_COLLIN,
            ENEMY_COLLIN,
            ENEMY_OCTOS,
            ENEMY_OCTOS,
            ENEMY_OCTOS,
            ENEMY_OCTOS          
        ]
    ],[
        //WORLD4
        [ENEMY_NONE],[
            ENEMY_TOTEM,
            ENEMY_MOILA,
            ENEMY_SYREN,
            ENEMY_SYREN,
            ENEMY_DAPHNE,
            ENEMY_DAPHNE,
            ENEMY_DAPHNE,
            ENEMY_ZUREE,
            ENEMY_ZUREE,
            ENEMY_ZUREE
        ],[
            ENEMY_TOTEM,
            ENEMY_TOTEM,
            ENEMY_MOILA,
            ENEMY_SYREN,
            ENEMY_SYREN,
            ENEMY_DAPHNE,
            ENEMY_DAPHNE,
            ENEMY_ZUREE,
            ENEMY_ZUREE,
            ENEMY_ZUREE
        ],[
            ENEMY_TOTEM,
            ENEMY_TOTEM,
            ENEMY_TOTEM,
            ENEMY_MOILA,
            ENEMY_MOILA,
            ENEMY_MOILA,
            ENEMY_SYREN,
            ENEMY_SYREN,
            ENEMY_DAPHNE,
            ENEMY_DAPHNE
        ]

    ]

]

const ENEMY_TABLE3 = [
    [
        //WORLD0
    ],
    [
        //WORLD1
        [
            ENEMY_NONE
        ],[
            //EASY
            ENEMY_SHEMUN,
            ENEMY_SHEMUN,
            ENEMY_SHEMUN,
            ENEMY_MCGOO,
            ENEMY_REAPER,
            ENEMY_NONE,
            ENEMY_NONE,
            ENEMY_NONE,
            ENEMY_NONE,
            ENEMY_NONE
        ],[
            //NORMAL
            ENEMY_SHEMUN,
            ENEMY_SHEMUN,
            ENEMY_SHEMUN,
            ENEMY_SHEMUN,
            ENEMY_MCGOO,
            ENEMY_MCGOO,
            ENEMY_REAPER,
            ENEMY_NONE,
            ENEMY_NONE,
        ],[
            //HARD
            ENEMY_SHEMUN,
            ENEMY_SHEMUN,
            ENEMY_SHEMUN,
            ENEMY_SHEMUN,
            ENEMY_SHEMUN,
            ENEMY_MCGOO,
            ENEMY_MCGOO,
            ENEMY_MCGOO,
            ENEMY_REAPER,
            ENEMY_REAPER,
            ENEMY_REAPER    
        ]
    ],[
        //WORLD2
        [ENEMY_NONE],[
            ENEMY_GIRIN,
            ENEMY_SNOWMAN,
            ENEMY_NONE,
            ENEMY_NONE,
            ENEMY_NONE,
            ENEMY_NONE,
            ENEMY_NONE,
            ENEMY_NONE,
            ENEMY_NONE,
            ENEMY_NONE
        ],[
            ENEMY_GIRIN,
            ENEMY_SNOWMAN,
            ENEMY_GIRIN,
            ENEMY_SNOWMAN,
            ENEMY_NONE,
            ENEMY_NONE,
            ENEMY_NONE,
            ENEMY_NONE,
            ENEMY_NONE,
            ENEMY_NONE,
        ],[
            ENEMY_GIRIN,
            ENEMY_SNOWMAN,
            ENEMY_GIRIN,
            ENEMY_SNOWMAN,
            ENEMY_GIRIN,
            ENEMY_SNOWMAN,
            ENEMY_NONE,
            ENEMY_NONE,
            ENEMY_NONE,
            ENEMY_NONE,
        ]
    ],[
        //WORLD3
        [ENEMY_NONE],[
            ENEMY_SHEMUN,
            ENEMY_SHEMUN,
            ENEMY_SHEMUN,
            ENEMY_SHEMUN,
            ENEMY_HOLER,
            ENEMY_HOLER,
            ENEMY_REAPER,
            ENEMY_NONE,
            ENEMY_NONE,
            ENEMY_NONE
        ],[
            ENEMY_SHEMUN,
            ENEMY_SHEMUN,
            ENEMY_SHEMUN,
            ENEMY_SHEMUN,
            ENEMY_HOLER,
            ENEMY_HOLER,
            ENEMY_HOLER,
            ENEMY_REAPER,
            ENEMY_NONE,
            ENEMY_NONE
        ],[
            ENEMY_SHEMUN,
            ENEMY_SHEMUN,
            ENEMY_SHEMUN,
            ENEMY_SHEMUN,
            ENEMY_HOLER,
            ENEMY_HOLER,
            ENEMY_HOLER,
            ENEMY_HOLER,
            ENEMY_HOLER,            
            ENEMY_REAPER,
            ENEMY_REAPER,
        ]
    ],[
        //WORLD4
        [ENEMY_NONE],[
            ENEMY_ERINUS,
            ENEMY_ERINUS,
            ENEMY_NONE,
            ENEMY_NONE,
            ENEMY_NONE,
            ENEMY_NONE,
            ENEMY_NONE,
            ENEMY_NONE,
            ENEMY_NONE,
            ENEMY_NONE
        ],[
            ENEMY_ERINUS,
            ENEMY_ERINUS,
            ENEMY_ERINUS,
            ENEMY_ERINUS,
            ENEMY_NONE,
            ENEMY_NONE,
            ENEMY_NONE,
            ENEMY_NONE,
            ENEMY_NONE,
            ENEMY_NONE
        ],[
            ENEMY_ERINUS,
            ENEMY_ERINUS,
            ENEMY_ERINUS,
            ENEMY_ERINUS,
            ENEMY_ERINUS,
            ENEMY_ERINUS,
            ENEMY_ERINUS,
            ENEMY_ERINUS,
            ENEMY_ERINUS,
            ENEMY_ERINUS

        ]
    ]
]

module.exports = {screenRules, screens, ENEMY_TABLE1, ENEMY_TABLE3, ENEMY_REAPER, screensByWorldAndAddress, ENEMY_PLUTON, ENEMY_PLUTONFLY}
