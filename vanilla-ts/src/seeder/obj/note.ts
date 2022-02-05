import { Alteration } from "./alterations";
import { Notations } from "./notations";

export class Note {
    code: string;
    names: Notations
    tone: number;
    alteration: Alteration;
    getName() { return this.names.english + this.alteration.signe; }
    
}