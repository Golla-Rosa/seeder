import { ChordGap } from "./chord.gap";
import { Intervalle } from "./intervalle";
import { Note } from "./note";

export class Scale {
    code: string;
    name: string;
    notes: Note[] = [];
    intervals: Intervalle[] = [];
    gap: ChordGap;
    tons: number [] = []
}