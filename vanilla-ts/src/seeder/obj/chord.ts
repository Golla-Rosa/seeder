import { ChordMold } from "./chord.mold";
import { Intervalle } from "./intervalle";
import { Notations } from "./notations";
import { Note } from "./note";

export class Chord extends Notations {
    tones: number[];
    mold: ChordMold;
}