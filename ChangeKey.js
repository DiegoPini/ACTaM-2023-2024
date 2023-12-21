/*
The part played by an instrument is described by an array in which each element represent the midi note
played in the corresponding 16th.
The velocity of the notes are contained in another array.
*/ 


// Take the matrix in the original key and returns a matrix in the new key
// Original matrix in the key of C
function changeKey(originalMat, oldKey, newKey) {
    var newMat = [];
    var interval = key2midiPitch(newKey) - key2midiPitch(oldKey); // 60 is the MIDI pitch of C4

    if (interval > 6) {
        interval = interval - 12;
    }
    /*
    else if (interval < -6) {
        interval = interval + 12;
    }
    */
    
    for (i=0; i<originalMat.length; i++) {
        if (originalMat[i] != 0) {
            newMat[i] = originalMat[i] + interval;
        }
        else {
            newMat[i] = 0;
        }
    }

    return newMat;
}

// Take as input 2 MIDI pitches and returns the interval between them ignoring the octave distances
function minInterval(pitch1, pitch2){
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
        case "C" || "Cm":
            midiPitch = 60;
            break;
        case "C#" || "C#m":
            midiPitch = 61;
            break;
        case "D" || "Dm":
            midiPitch = 62;
            break;
        case "D#" || "D#m":
            midiPitch = 63;
            break;
        case "E" || "Em":
            midiPitch = 64;
            break;
        case "F" || "Fm":
            midiPitch = 65;
            break;
        case "F#" || "F#m":
            midiPitch = 66;
            break;
        case "G" || "Gm":
            midiPitch = 67;
            break;
        case "G#" || "G#m":
            midiPitch = 68;
            break;
        case "A" || "Am":
            midiPitch = 69;
            break;
        case "A#" || "A#m":
            midiPitch = 70;
            break;
        case "B" || "Bm":
            midiPitch = 71;
            break;
        default:
            midiPitch = 60;
            break;
    }
    return midiPitch;
}