import { Alteration } from "./alterations";
import { Gap } from "./interval.gap";
import { Notations } from "./notations";
import { Note } from "./note";

export class Intervalle {
    code: string;
    names: Notations;
    libelleProvisoire: string;
    notes: Note[] = [];
    tons: number[] = [];
    gap: Gap;
    tone: number;

    getName(): string {
        return this.notes[0].getName() + " " + this.gap.name 
    }
}