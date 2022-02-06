import { IntervalleMolde } from "./interval.mold";
import { Notations } from "./notations";
import { Note } from "./note";

export class ChordMold extends Notations {
    
    type: Notations;
    nature: Notations;
    tones: number[] = [];

    getName(): string {
        return this.nature.english
    }
}