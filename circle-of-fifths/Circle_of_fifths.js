let major_scale = [0, 2, 4, 5, 7, 9, 11, 12];
let minor_nat_scale = [0, 2, 3, 5, 7, 8, 10, 12];
let minor_arm_scale = [0, 2, 3, 5, 7, 8, 11, 12];
let ionic_scale = [0,2,3,5,7,9,10,12];
let phrygian_scale = [0,1,3,5,7,8,10,12]
let chosen_scale = major_scale;

document.addEventListener('DOMContentLoaded', function() {
var change_scale = document.getElementById('change_scale');

//listener per il menù a tendina cambio scala
change_scale.addEventListener('change', function() {
if (change_scale.value === "minor_nat_scale")
chosen_scale = minor_nat_scale;
else if (change_scale.value === "minor_arm_scale")
chosen_scale = minor_arm_scale;
else if (change_scale.value === "major_scale")
chosen_scale = major_scale;
else if (change_scale.value === "ionic_scale")
chosen_scale = ionic_scale;
else if (change_scale.value === "phrygian_scale")
chosen_scale = phrygian_scale;
else
console.log("error")
});
});

window.addEventListener('load', function() {

notes = [document.getElementById('a'), document.getElementById('bb'),
    document.getElementById('b'), document.getElementById('c'),
    document.getElementById('db'), document.getElementById('d'),
    document.getElementById('eb'), document.getElementById('e'),
    document.getElementById('f'), document.getElementById('gb'),
    document.getElementById('g'), document.getElementById('ab')];

scales = [document.getElementById('A'), document.getElementById('Bb'),
    document.getElementById('B'), document.getElementById('C'),
    document.getElementById('Db'), document.getElementById('D'),
    document.getElementById('Eb'), document.getElementById('E'),
    document.getElementById('F'), document.getElementById('Gb'),
    document.getElementById('G'), document.getElementById('Ab')];

scales.forEach(function(scale) {
//listener per cambio chiave
    scale.addEventListener('click', function() {
//cancello i tasti colorati precedentemente
/*notes.forEach(function(note){
note.style.fill="#FE938C"; });
scales.forEach(function(sc){
sc.style.fill="#FE938C";
});*/

    notes.forEach(function(note){
    note.classList.remove("note_selected"); });
    scales.forEach(function(sc){
    sc.classList.remove("scale_selected");});

    //scale.className = 'scale_selected';
    scale.classList.add("scale_selected");
    var index = scales.indexOf(scale);
    for (var i = 0; i < 8; i++){
        ind = (chosen_scale[i]+index)%12;
        //notes[ind].classList.add("note_selected");
        //notes[ind].style.fill="#91B6B7";
        notes[ind].classList.add("note_selected");
    }

    });
});


});