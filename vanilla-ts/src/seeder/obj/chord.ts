import { ChordGap } from "./chord.gap";
import { Intervalle } from "./intervalle";
import { Note } from "./note";

export class Chord {
    code: string;
    name: string;
    notes: Note[] = [];
    intervals: Intervalle[] = [];
    gap: ChordGap;

    toString() {
        var x = this.intervals.map(i => i.notes);
        var notes = x.map(notes => notes.map(n => n.getName()))
        console.log(this.name , notes )
    }
}