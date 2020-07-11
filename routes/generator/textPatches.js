

function getTitleTextPatch(seed) {

    //A = D2
    //b = D3
    //C = d4
    //etc

    let alphabet = {
        name: "Adds alphabet to title screen",
        data: "38 44 82 82 FE 82 82 00 00 00 00 00 00 00 00 00 FC 42 42 7C 42 42 FC 00 00 00 00 00 00 00 00 00 7C 82 80 80 80 82 7C 00 00 00 00 00 00 00 00 00 FC 42 42 42 42 42 FC 00 00 00 00 00 00 00 00 00 FE 42 48 78 48 42 FE 00 00 00 00 00 00 00 00 00 FE 42 48 78 48 40 E0 00 00 00 00 00 00 00 00 00 7C 82 80 8E 82 86 7A 00 00 00 00 00 00 00 00 00 C6 44 44 7C 44 44 C6 00 00 00 00 00 00 00 00 00 7C 10 10 10 10 10 7C 00 00 00 00 00 00 00 00 00 0E 04 04 84 84 84 78 00 00 00 00 00 00 00 00 00 E6 4C 58 70 58 4C E6 00 00 00 00 00 00 00 00 00 E0 40 40 40 40 42 FE 00 00 00 00 00 00 00 00 00 82 C6 AA 92 82 82 C6 00 00 00 00 00 00 00 00 00 C6 64 54 54 4C 44 C6 00 00 00 00 00 00 00 00 00 7C 82 82 82 82 82 7C 00 00 00 00 00 00 00 00 00 FC 42 42 7C 40 40 E0 00 00 00 00 00 00 00 00 00 7C 82 82 82 BA 84 7A 00 00 00 00 00 00 00 00 00 FC 42 42 7C 48 4A E6 00 00 00 00 00 00 00 00 00 7C 82 80 78 06 82 7C 00 00 00 00 00 00 00 00 00 FE 92 10 10 10 10 38 00 00 00 00 00 00 00 00 00 82 82 82 82 82 82 7C 00 00 00 00 00 00 00 00 00 82 82 82 82 44 28 10 00 00 00 00 00 00 00 00 00 82 82 92 92 92 AA 44 00 00 00 00 00 00 00 00 00 82 44 28 10 28 44 82 00 00 00 00 00 00 00 00 00 C6 44 28 10 10 10 38 00 00 00 00 00 00 00 00 00 FE 84 08 10 20 42 FE 00 00 00 00 00 00 00 00 00".split(" "),
        offset: 0x3d30,
    }

    const letterLookup = []

    
    letterLookup['0'] = 0x00;    
    letterLookup['1'] = 0x01;
    letterLookup['2'] = 0x02;
    letterLookup['3'] = 0x03;
    letterLookup['4'] = 0x04;
    letterLookup['5'] = 0x05;
    letterLookup['6'] = 0x06;
    letterLookup['7'] = 0x07;
    letterLookup['8'] = 0x08;
    letterLookup['9'] = 0x09;
    
    letterLookup['A'] = 0xd2;
    letterLookup['B'] = 0xd3;
    letterLookup['C'] = 0xd4;
    letterLookup['D'] = 0xd5;
    letterLookup['E'] = 0xd6;
    letterLookup['F'] = 0xd7;
    letterLookup['G'] = 0xd8;
    letterLookup['H'] = 0xd9;
    letterLookup['I'] = 0xda;
    letterLookup['J'] = 0xdb;
    letterLookup['K'] = 0xdc;
    letterLookup['L'] = 0xdd;
    letterLookup['M'] = 0xde;
    letterLookup['N'] = 0xdf;
    letterLookup['O'] = 0xe0;
    letterLookup['P'] = 0xe1;
    letterLookup['Q'] = 0xe2;
    letterLookup['R'] = 0xe3;
    letterLookup['S'] = 0xe4;
    letterLookup['T'] = 0xe5;
    letterLookup['U'] = 0xe6;
    letterLookup['V'] = 0xe7;
    letterLookup['W'] = 0xe8;
    letterLookup['X'] = 0xe9;
    letterLookup['Y'] = 0xea;
    letterLookup['Z'] = 0xeb;
    letterLookup[' '] = 0x12;
    letterLookup["BORDER"] = 0x1f;

    let textPatch1 = {
        name: "Line 1 of title text patch",
        data: [
            letterLookup["K"],
            letterLookup["I"],
            letterLookup["D"],
            letterLookup[" "],
            letterLookup["I"],
            letterLookup["C"],
            letterLookup["A"],
            letterLookup["R"],
            letterLookup["U"],
            letterLookup["S"],
        ],
        offset: 0x63c3
    }

    let textPatch2 = {
        name: "line 2 of title text patch",
        data: [            
            letterLookup["R"],
            letterLookup["A"],
            letterLookup["N"],
            letterLookup["D"],
            letterLookup["O"],
            letterLookup["M"],
            letterLookup["I"],
            letterLookup["Z"],
            letterLookup["E"],
            letterLookup["R"],            
        ],
        offset: 0x63e3
    }

    let textPatch3 = {
        name: "line 3 of title text patch",
        data: [           
            letterLookup["BORDER"], 
            letterLookup["B"],
            letterLookup["Y"],
            letterLookup[" "],
            letterLookup["F"],
            letterLookup["B"],
            letterLookup["S"],
            letterLookup[" "],
            letterLookup["A"],
            letterLookup["N"],
            letterLookup["D"],      
            letterLookup["BORDER"],      
        ],
        offset: 0x6402
    }

    let textPatch4 = {
        name: "line 4 of title text patch",
        data: [            
            letterLookup["R"],
            letterLookup["U"],
            letterLookup["M"],
            letterLookup["B"],
            letterLookup["L"],
            letterLookup["E"],
            letterLookup["M"],
            letterLookup["I"],
            letterLookup["N"],
            letterLookup["Z"], 
            letterLookup["E"],  
            letterLookup["BORDER"],         
        ],
        offset: 0x6422
    }

    let addSeedNamePatch = {
        name: "Add seed name to title screen",
        data: [],
        offset: 0x64c5
    }

    for (var i = 0; i < seed.length; i++) {
        addSeedNamePatch.data.push(letterLookup[seed.charAt(i)])
    }

    return [alphabet, textPatch1, textPatch2, textPatch3, textPatch4, addSeedNamePatch]
}


function getEndingTextPatch(seed) {

    //A = 16
    //B = 17
    //C = 18
    //etc

    //let alphabet = {
        //name: "Adds alphabet to title screen",
        //data: "38 44 82 82 FE 82 82 00 00 00 00 00 00 00 00 00 FC 42 42 7C 42 42 FC 00 00 00 00 00 00 00 00 00 7C 82 80 80 80 82 7C 00 00 00 00 00 00 00 00 00 FC 42 42 42 42 42 FC 00 00 00 00 00 00 00 00 00 FE 42 48 78 48 42 FE 00 00 00 00 00 00 00 00 00 FE 42 48 78 48 40 E0 00 00 00 00 00 00 00 00 00 7C 82 80 8E 82 86 7A 00 00 00 00 00 00 00 00 00 C6 44 44 7C 44 44 C6 00 00 00 00 00 00 00 00 00 7C 10 10 10 10 10 7C 00 00 00 00 00 00 00 00 00 0E 04 04 84 84 84 78 00 00 00 00 00 00 00 00 00 E6 4C 58 70 58 4C E6 00 00 00 00 00 00 00 00 00 E0 40 40 40 40 42 FE 00 00 00 00 00 00 00 00 00 82 C6 AA 92 82 82 C6 00 00 00 00 00 00 00 00 00 C6 64 54 54 4C 44 C6 00 00 00 00 00 00 00 00 00 7C 82 82 82 82 82 7C 00 00 00 00 00 00 00 00 00 FC 42 42 7C 40 40 E0 00 00 00 00 00 00 00 00 00 7C 82 82 82 BA 84 7A 00 00 00 00 00 00 00 00 00 FC 42 42 7C 48 4A E6 00 00 00 00 00 00 00 00 00 7C 82 80 78 06 82 7C 00 00 00 00 00 00 00 00 00 FE 92 10 10 10 10 38 00 00 00 00 00 00 00 00 00 82 82 82 82 82 82 7C 00 00 00 00 00 00 00 00 00 82 82 82 82 44 28 10 00 00 00 00 00 00 00 00 00 82 82 92 92 92 AA 44 00 00 00 00 00 00 00 00 00 82 44 28 10 28 44 82 00 00 00 00 00 00 00 00 00 C6 44 28 10 10 10 38 00 00 00 00 00 00 00 00 00 FE 84 08 10 20 42 FE 00 00 00 00 00 00 00 00 00".split(" "),
        //offset: 0x3d30,
    //}

    const letterLookup = []
    
    letterLookup['0'] = 0x00;    
    letterLookup['1'] = 0x01;
    letterLookup['2'] = 0x02;
    letterLookup['3'] = 0x03;
    letterLookup['4'] = 0x04;
    letterLookup['5'] = 0x05;
    letterLookup['6'] = 0x06;
    letterLookup['7'] = 0x07;
    letterLookup['8'] = 0x08;
    letterLookup['9'] = 0x09;
    
    letterLookup['A'] = 0x16;
    letterLookup['B'] = 0x17;
    letterLookup['C'] = 0x18;
    letterLookup['D'] = 0x19;
    letterLookup['E'] = 0x1A;
    letterLookup['F'] = 0x1B;
    letterLookup['G'] = 0x1C;
    letterLookup['H'] = 0x1D;
    letterLookup['I'] = 0x1E;
    letterLookup['J'] = 0x1F;
    letterLookup['K'] = 0x20;
    letterLookup['L'] = 0x21;
    letterLookup['M'] = 0x22;
    letterLookup['N'] = 0x23;
    letterLookup['O'] = 0x24;
    letterLookup['P'] = 0x25;
    letterLookup['Q'] = 0x26;
    letterLookup['R'] = 0x27;
    letterLookup['S'] = 0x28;
    letterLookup['T'] = 0x29;
    letterLookup['U'] = 0x2A;
    letterLookup['V'] = 0x2B;
    letterLookup['W'] = 0x2C;
    letterLookup['X'] = 0x2D;
    letterLookup['Y'] = 0x2E;
    letterLookup['Z'] = 0x2F;

    letterLookup['?'] = 0x0A;
    letterLookup['='] = 0x0B;
    letterLookup[','] = 0x0C;
    letterLookup['.'] = 0x0D;
    letterLookup['!'] = 0x0E;
    letterLookup['-'] = 0x0F;
    letterLookup['\''] = 0x10; //apostrophe
    letterLookup['/'] = 0x11;  //slash (see note below)
    letterLookup[' '] = 0x12;
    letterLookup['_'] = 0x4A;
    //note: 0x11 is a degrees symbol that we don't need.  So we'll 
    //replace it with a slash (soon), which we need for URLs.    

    let textPatch1 = {
        name: "Ending text patch (our credits)",
        data: [
            letterLookup["K"],
            letterLookup["I"],
            letterLookup["D"],
            letterLookup[" "],
            letterLookup["I"],
            letterLookup["C"],
            letterLookup["A"],
            letterLookup["R"],
            letterLookup["U"],
            letterLookup["S"],
            letterLookup[" "],
            letterLookup["R"],
            letterLookup["A"],
            letterLookup["N"],
            letterLookup["D"],
            letterLookup["O"],
            letterLookup[" "],
            letterLookup[" "],
            letterLookup[" "],
            letterLookup[" "],
            0xFF, 0x21, 0x44, 
            letterLookup[" "], 
            letterLookup[" "], 
            letterLookup["B"], 
            letterLookup["Y"], 
            letterLookup[" "], 
            letterLookup["R"], 
            letterLookup["U"], 
            letterLookup["M"], 
            letterLookup["B"], 
            letterLookup["L"], 
            letterLookup["E"], 
            letterLookup["M"], 
            letterLookup["I"], 
            letterLookup["N"], 
            letterLookup["Z"], 
            letterLookup["E"], 
            letterLookup[" "], 
            letterLookup[" "], 
            letterLookup[" "], 
            letterLookup[" "], 
            letterLookup[" "], 
            letterLookup[" "], 
            0xFF, 0x21, 0x84, 
            letterLookup[" "], 
            letterLookup[" "], 
            letterLookup["A"], 
            letterLookup["N"], 
            letterLookup["D"], 
            letterLookup[" "], 
            letterLookup["F"], 
            letterLookup["R"], 
            letterLookup["U"], 
            letterLookup["I"], 
            letterLookup["T"], 
            letterLookup["B"], 
            letterLookup["A"], 
            letterLookup["T"], 
            letterLookup["S"], 
            letterLookup["A"], 
            letterLookup["L"], 
            letterLookup["A"], 
            letterLookup["D"], 
            letterLookup[" "], 
            letterLookup[" "], 
            letterLookup[" "], 
            letterLookup[" "],             
            0xFF, 0x21, 0xC4,             
            letterLookup["S"], 
            letterLookup["P"], 
            letterLookup["E"], 
            letterLookup["C"], 
            letterLookup["I"], 
            letterLookup["A"], 
            letterLookup["L"], 
            letterLookup[" "], 
            letterLookup["T"], 
            letterLookup["H"], 
            letterLookup["A"], 
            letterLookup["N"], 
            letterLookup["K"], 
            letterLookup["S"], 
            letterLookup[" "], 
            0xFF, 0x22, 0x04, 
            letterLookup[" "], 
            letterLookup[" "], 
            letterLookup["A"], 
            letterLookup["I"], 
            letterLookup["S"], 
            letterLookup["N"], 
            letterLookup["A"], 
            letterLookup["K"], 
            letterLookup["E"], 
            letterLookup[","], 
            letterLookup[" "], 
            letterLookup[" "], 
            letterLookup[" "], 
            letterLookup[" "], 
            0xFF, 0x22, 0x44, 
            letterLookup[" "], 
            letterLookup[" "], 
            letterLookup["D"], 
            letterLookup["A"],             
            letterLookup["V"], 
            letterLookup["I"], 
            letterLookup["D"], 
            letterLookup[","], 
            letterLookup[" "], 
            letterLookup["K"], 
            letterLookup["I"], 
            letterLookup["P"], 
            letterLookup["P"], 
            letterLookup[","], 
            0xFF, 0x22, 0x84,           
            letterLookup[" "], 
            letterLookup[" "], 
            letterLookup["M"], 
            letterLookup["A"], 
            letterLookup["N"], 
            letterLookup["I"], 
            letterLookup["A"], 
            letterLookup["C"], 
            letterLookup["A"], 
            letterLookup["L"], 
            letterLookup["4"], 
            letterLookup["2"], 
            letterLookup[" "], 
            letterLookup[" "], 
            0xFF, 0xA9, 0x00,         
        ],
        offset: 0x010264
        //Medusa was destroyed and the light of peace...        
    }
    
    let textPatch2 = {
        name: "Ending text patch (above THE END)",
        data: [
            letterLookup[" "], //_
            letterLookup["K"], //C
            letterLookup["I"], //O
            letterLookup["D"], //P
            letterLookup[" "], //Y
            letterLookup["I"], //R
            letterLookup["C"], //I
            letterLookup["A"], //G
            letterLookup["R"], //H
            letterLookup["U"], //T
            letterLookup["S"], //
            letterLookup[" "], //
            letterLookup[" "], //1
            letterLookup["R"], //9
            letterLookup["A"], //8
            letterLookup["N"], //6
            letterLookup["D"], //N
            letterLookup["O"], //I
            letterLookup["M"], //N
            letterLookup["I"], //T
            letterLookup["Z"], //E
            letterLookup["E"], //N
            letterLookup["R"], //D
            letterLookup[" "], //O            
        ],
        offset: 0x0110E6
        //_Copyright__1986Nintendo
    }    
    
    let textPatch3 = {
        name: "Ending text patch (URL below THE END)",
        data: [
            letterLookup["B"], //_
            letterLookup["I"], //_
            letterLookup["T"], //_
            letterLookup["."], //_
            letterLookup["L"], //P
            letterLookup["Y"], //U
            letterLookup["/"], //S
            letterLookup[" "], //H
            letterLookup[" "], //_
            letterLookup[" "], //_
            letterLookup[" "], //_
            letterLookup[" "], //_
            letterLookup[" "], //S
            letterLookup[" "], //T
            letterLookup[" "], //A
            letterLookup[" "], //R
            letterLookup[" "], //T
            letterLookup["2"], //_
            letterLookup["Q"], //B
            letterLookup["4"], //U
            letterLookup["L"], //T
            letterLookup["J"], //T
            letterLookup["B"], //O
            letterLookup["P"], //N            
        ],
        offset: 0x011116
        //_Copyright__1986Nintendo
    }    
    
    let textPatch4 = {
        name: "Ending text patch (slash)",
        data: [
            0x02, 0x06, 0x0C, 0x18, 0x30, 0x60, 0x40, 0x00
        ],
        offset: 0x1120
        //This replaces the degree symbol with a slash
    }    

    return [textPatch1, textPatch2, textPatch3, textPatch4]
}


module.exports = {getEndingTextPatch, getTitleTextPatch}