import { ChordMold } from "./chord.mold";
import { Intervalle } from "./intervalle";
import { Note } from "./note";

export class Scale {
    code: string;
    name: string;
    notes: Note[] = [];
    intervals: Intervalle[] = [];
    gap: ChordMold;
    tons: number [] = []
}