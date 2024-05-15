/*
The part played by an instrument is described by an array in which each element represent the midi note
played in the corresponding 16th.
*/ 


// Take the matrix in the original key and returns a matrix in the new key
function changeKey(originalMat, copyMat, oldKey, newKey) {
    // Original matrix in the key of C
    // Matrix example: originalMat = [60, 62, 64, 65, 67, 69, 71, 72];
    // copyMat è una copia di originalMat. copyMat viene modificata, originalMat no in modod da preservare la partitura originale
    // instNotesOriginal = myJSON[index].Inst_notes;       // partitura note
    // instNotesCopy = JSON.parse(JSON.stringify(instNotesOriginal));       // partitura note
    // fare copyMat = originalMat non funziona perchè copyMat punterà sempre a originalMat e quindi se si modifica copyMat si modifica anche originalMat

    var interval = key2midiPitch(newKey) - key2midiPitch(oldKey); // 60 is the MIDI pitch of C4

    if (interval > 6) {
        interval = interval - 12;
    }
    
    for (i=0; i<originalMat.length; i++) {
        if (originalMat[i] != 0) {
            copyMat[i] = originalMat[i] + interval;
        }
    }
}


// Take as input 2 MIDI pitches and returns the interval between them ignoring the octave distances
function minInterval(pitch1, pitch2){
    if (pitch1 < pitch2){
        var temp = pitch1;
        pitch1 = pitch2;
        pitch2 = temp;
    }
    var interval = pitch1 - pitch2;
    while (interval > 12){
        interval = interval - 12;
    }
    return interval;
}


// Take as input the string of the key and returns the MIDI pitch of the tonic
function key2midiPitch(key){
    var midiPitch = 60;
    switch (key) {
        case "C":
        case "Cm":
            midiPitch = 60;
            break;
        case "C#":
        case "C#m":
        case "Db":
        case "Dbm":
            midiPitch = 61;
            break;
        case "D":
        case "Dm":
            midiPitch = 62;
            break;
        case "D#":
        case "D#m":
        case "Eb":
        case "Ebm":
            midiPitch = 63;
            break;
        case "E":
        case "Em":
            midiPitch = 64;
            break;
        case "F":
        case "Fm":
            midiPitch = 65;
            break;
        case "F#":
        case "F#m":
        case "Gb":
        case "Gbm":
            midiPitch = 66;
            break;
        case "G":
        case "Gm":
            midiPitch = 67;
            break;
        case "G#":
        case "G#m":
        case "Ab":
        case "Abm":
            midiPitch = 68;
            break;
        case "A":
        case "Am":
            midiPitch = 69;
            break;
        case "A#":
        case "A#m":
        case "Bb":
        case "Bbm":
            midiPitch = 70;
            break;
        case "B":
        case "Bm":
            midiPitch = 71;
            break;
    }
    return midiPitch;
}