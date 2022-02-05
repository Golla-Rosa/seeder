import { Gap } from "./interval.gap";
import { Notations } from "./notations";
import { Note } from "./note";

export class ChordGap
{
    code: string;
    names: Notations;
    libelleProvisoire: string;
    notes: Note[] = [];
    tons: number[] = [];
    gaps: Gap[];
    tone: number;
    nature: Notations;

    getName(): string {
        return this.nature.english
    }
}