import { Note } from "./obj/note";
import { NOTATION_LIST } from "./constants/notations.list"
import { ALTERATION_LIST } from "./constants/alterations.list";
import { Intervalle } from "./obj/intervalle";
import { Gap } from "./obj/interval.gap";
import { INTERVAL_TYPES } from "./constants/intervalle.types";
import { INTERVAL_NATURES } from "./constants/intervalle.natures";
import { ChordGap } from "./obj/chord.gap";
import { Chord } from "./obj/chord";
export class NotesGenerator {
    notes: Note[];
    
    gaps: Gap[];
    intervals: Intervalle[];

    chordShapes: ChordGap[];
    chords: Chord[];
    constructor() {
        this.notes = this.generateNotes();
        this.manageIntervals();
        this.manageChords();
    }

    generateNotes(): Note[] {
        var noteList: Note[] = [];
        for (let i = 0; i < NOTATION_LIST.length; i++) {
            const notation = NOTATION_LIST[i];
            for (let x = 0; x < ALTERATION_LIST.length; x++) {
                const alteration = ALTERATION_LIST[x];
                const note: Note = new Note();
                note.code = `N${i}${x}`
                note.names = notation;
                note.tone = notation.tone + alteration.tone;
                note.alteration = alteration;
                console.log(note.getName(), notation.tone, alteration.tone, note.tone)
                noteList.push(note)
            }
        }
        return noteList;
    }

    manageIntervals() {
        this.gaps = this.generateGaps();
        this.intervals = this.generateIntervals();
        return
    }

    generateGaps(): Gap[] {
        var gaps: Gap[] = []
        for (let i = 0; i < INTERVAL_TYPES.length; i++) {
            const intervalType = INTERVAL_TYPES[i];
            for (let x = 0; x < INTERVAL_NATURES.length; x++) {
                const intervalNature = INTERVAL_NATURES[x];
                const gap: Gap = new Gap();
                gap.code = `IG${i}${x}`
                gap.nature = intervalNature;
                gap.type = intervalType;
                gap.ton = intervalType.tone+ intervalNature.tone;

                console.log(intervalNature, gap.ton, intervalType.tone, intervalNature.tone);
                gap.name = `${intervalType.english} ${intervalNature.english}`
                gaps.push(gap);
            }
        }
        return gaps;
    }
    generateIntervals(): Intervalle[]  {
        var intervals: Intervalle[] = [];
        for (let i = 0; i < this.notes.length; i++) {
            const note = this.notes[i];
            for (let x = 0; x < this.gaps.length; x++) {
                const interval: Intervalle = new Intervalle();
                const gap = this.gaps[x];

                
                
                interval.code = `IT${i}${x}`
                interval.notes.push(note);
                interval.notes.push(this.notes.find(n => n.tone === gap.ton + note.tone));
                interval.gap = gap;
                interval.tons = [note.tone, gap.ton + note.tone]
                interval.libelleProvisoire = `${interval.getName()}`
                intervals.push(interval)
            }
        }
        return intervals;
    }

    manageChords() {
        this.chordShapes = this.generateChordShapes();
        this.chords = this.generateChords();
    }

    generateChords() : Chord[] {
        var chords: Chord[] = [];
        for (let i = 0; i < this.notes.length; i++) {
            const note = this.notes[i];
            for (let x = 0; x < this.chordShapes.length; x++) {
                const chordShape = this.chordShapes[x];
                var chord = new Chord();
                chord.code = `CH${i}${x}`
                chord.gap = chordShape;
                chord.intervals.push(
                    this.intervals.find(i => i.tons[0] == note.tone && i.gap.code === chordShape.gaps[0].code),                )
                    chord.intervals.push(
 
                this.intervals.find(i => i.tons[0] == chord.intervals[0].tons[1] && i.gap.code === chordShape.gaps[1].code),
                
 )
                chord.name = note.getName() + " " + chord.gap.getName();
                chords.push(chord);
            }
        }
        return chords;
    }
    generateChordShapes(): ChordGap[] {
        var chordGaps: ChordGap[] = [];
        for (let i = 0; i < INTERVAL_NATURES.length; i++) {
            const nature = INTERVAL_NATURES[i];

            var accord: ChordGap = new ChordGap();
            accord.nature = nature;
            accord.code = `AC${i}`;
            accord.libelleProvisoire = accord.getName();
            switch (nature.code) {
                case "NA1":
                    accord.gaps = [
                        this.gaps.find(g => g.nature.code == "NA1" && g.type.code == "IT2"),
                        this.gaps.find(g => g.nature.code == "NA3"  && g.type.code == "IT2"),
                    ];
                    break;
                case "NA2":
                    accord.gaps = [
                        this.gaps.find(g => g.nature.code == "NA1" && g.type.code == "IT2"),
                        this.gaps.find(g => g.nature.code == "NA1" && g.type.code == "IT2"),
                    ];
                    break;
                case "NA3":
                    accord.gaps = [
                        this.gaps.find(g => g.nature.code == "NA3" && g.type.code == "IT2"),
                        this.gaps.find(g => g.nature.code == "NA1" && g.type.code == "IT2"),
                    ];
                    break;
                case "NA4":
                    accord.gaps = [
                        this.gaps.find(g => g.nature.code == "NA3" && g.type.code == "IT2"),
                        this.gaps.find(g => g.nature.code == "NA3" && g.type.code == "IT2"),
                    ];
                    break;
                case "NA0": continue;
                
            }
            chordGaps.push(accord);
            
        }
    
        return chordGaps;
    }

}