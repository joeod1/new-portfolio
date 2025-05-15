import * as Tone from "tone";

const osc = new Tone.PolySynth(Tone.AMSynth).toDestination();

const baseFreq = document.getElementById("base-freq") as HTMLInputElement;
const noteGroup = document.getElementById("note-group") as HTMLDivElement;
const notes = [];
Array.from(noteGroup.children).forEach((node: HTMLInputElement) => {
    notes.push(node);
});




const chordRow = document.getElementById("chord-row");

document.onkeydown = (key) => {
    if (key.key != "space") return;
    const chordGroup = document.createElement("div");
    chordGroup.classList = "card";
    chordGroup.style.height = "256px";
    chordGroup.innerHTML = "okay king"
    chordRow.appendChild(chordGroup);
};






function parseChordAbbr(abbr: string) {
    return {
        note: parseInt(abbr.charAt(0)) - 1,
        major: abbr.charAt(1),
        // extra: abbr.substring(2),
    }
}

function getIntervals(chordRep: any) {
    return [
        chordRep.note,
        chordRep.note + (chordRep.major == 'M' ? 4: 3) % 12,
        chordRep.note + 7 % 12,
    ];
}

let current = 0;

const ratios = [
    1/1,
    16/15,
    9/8,
    6/5,
    5/4,
    4/3,
    7/5,
    3/2,
    8/5,
    5/3,
    9/5,
    15/8,
    2/1
];

let base = parseInt(baseFreq.value);

setInterval(()=>{
    console.log(notes);
    
    let intervals = getIntervals(parseChordAbbr(notes[current].value));
    intervals.forEach(interval => {
        osc.triggerRelease(
            `${Math.round(base * ratios[interval])}`,
        );
    });

    base = parseInt(baseFreq.value);

    

    // const prev = notes[current].value;
    current = (current + 1) % (notes.length);

    intervals = getIntervals(parseChordAbbr(notes[current].value));
    intervals.forEach(interval => {
        osc.triggerAttack(
            `${Math.round(base * ratios[interval])}`,
        );
    });

    // osc.triggerRelease();
    // osc.triggerAttack(Math.random() * 400 + 300, Tone.now());
}, 500);