import { IntervalleMolde } from "./interval.mold";
import { Notations } from "./notations";
import { Note } from "./note";

export class Intervalle {
    code: string;
    names: Notations;
    gap: IntervalleMolde;
    notes: number[];
    getName(): string {
        return this.names.english; 
    }
}