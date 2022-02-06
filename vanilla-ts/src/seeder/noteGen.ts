import { Note } from "./obj/note";
import { NOTATION_LIST } from "./constants/notations.list"
import { ALTERATION_LIST } from "./constants/alterations.list";
import { Intervalle } from "./obj/intervalle";
import { Gap } from "./obj/interval.gap";
import { INTERVAL_TYPES } from "./constants/intervalle.types";
import { INTERVAL_NATURES } from "./constants/intervalle.natures";
import { ChordGap } from "./obj/chord.gap";
import { Chord } from "./obj/chord";
import { ScaleGap } from "./obj/scale.gap";
import { SCALE_SHAPES } from "./constants/basic.scales";
import { Scale } from "./obj/scale";
export class NotesGenerator {
    notes: Note[];
    
    gaps: Gap[];
    intervals: Intervalle[];

    chordShapes: ChordGap[];
    chords: Chord[];
    scalesMold: Scale[];
    scales: Scale[];
    constructor() {
        this.notes = this.generateNotes();
        console.log(this.notes)
        // this.notes.push(...this.generateNotes())
        this.manageIntervals();
        this.manageChords();

        this.manageScales();
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
        console.log(intervals, "Interval")
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
 
                // trouver dans la liste des intervalles une intervalle qui a le meme ton que le deuxieme ton du premier interval de l'accord
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

    manageScales() {
        this.scalesMold = this.generateScaleMolds();
        this.scales = this.generateScales();
    }

    generateScales() {
        var scales: Scale[] = [];
        for (let i = 0; i < this.notes.length; i++) {
            const note = this.notes[i];
            for (let x = 0; x < this.scalesMold.length; x++) {
                const sMold = this.scalesMold[x];
                var scale: Scale = new Scale();
                scale.code = `SM${x}${i}`
                scale.tons = sMold.tons;
                scale.name = `${note.getName()} ${sMold.name}`
                scales.push(scale);
            }

        }
        return scales;
    }
    ArrayMove(array, from, to): [] {
        return array.splice(to, 0, array.splice(from, 1)[0])
    }
    generateScaleMolds(): Scale[] {
        var scales: Scale[] = [];
        
        for (let i = 0; i < SCALE_SHAPES.length; i++) {
            const scaleShap = SCALE_SHAPES[i];
            var { tons } = scaleShap;
            for (let x = 0; x < tons.length; x++) {
                var scale: Scale = new Scale();
                scale.code = `SM${x}${i}`;
                scale.tons = tons;
                scale.name = scaleShap.libelleProvisoire + x;
                scales.push(scale);
                this.ArrayMove(tons, 0, tons.length - 1)

            }
 
        }
        return scales;
        // List<GammeModel> gammeModels = new List<GammeModel>()
        //     {
        //         new GammeModel("Ionien", 0.ToString(), new List<Ecart>() {
        //         // Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         // Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         // Ecarts.Where(e => e.Ton == 0.5).FirstOrDefault(),
        //         // Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         // Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         // Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         // Ecarts.Where(e => e.Ton == 0.5).FirstOrDefault(),
        //     }, ModeEnum.Majeur),
        //     new GammeModel("Dorien", 1.ToString(), new List<Ecart>() {
        //         // Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         // Ecarts.Where(e => e.Ton == 0.5).FirstOrDefault(),
        //         // Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         // Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         // Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         // Ecarts.Where(e => e.Ton == 0.5).FirstOrDefault(),
        //         // Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),

        //     }, ModeEnum.Majeur),
        //      new GammeModel("Phrygien", 2.ToString(), new List<Ecart>() {
        //         // Ecarts.Where(e => e.Ton == 0.5).FirstOrDefault(),
        //         // Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         // Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         // Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         // Ecarts.Where(e => e.Ton == 0.5).FirstOrDefault(),
        //         // Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         // Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),


        //     }, ModeEnum.Majeur),
        //      new GammeModel("Lydien", 3.ToString(), new List<Ecart>() {
        //         // Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         // Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         // Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         // Ecarts.Where(e => e.Ton == 0.5).FirstOrDefault(),
        //         // Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         // Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         // Ecarts.Where(e => e.Ton == 0.5).FirstOrDefault(),
        //     }, ModeEnum.Majeur),
        //      new GammeModel("Myxolidien", 4.ToString(), new List<Ecart>() {
        //         // Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         // Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         // Ecarts.Where(e => e.Ton == 0.5).FirstOrDefault(),
        //         // Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         // Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         // Ecarts.Where(e => e.Ton == 0.5).FirstOrDefault(),
        //         // Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),

        //     }, ModeEnum.Majeur),
        //     new GammeModel("Mineur naturel", 5.ToString(), new List<Ecart>() {
        //         // Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         // Ecarts.Where(e => e.Ton == 0.5).FirstOrDefault(),
        //         // Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         // Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         // Ecarts.Where(e => e.Ton == 0.5).FirstOrDefault(),
        //         // Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         // Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),


        //     }, ModeEnum.Majeur),
        //      new GammeModel("Locrien", 6.ToString(), new List<Ecart>() {
        //         Ecarts.Where(e => e.Ton == 0.5).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 0.5).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //     }, ModeEnum.Majeur),

        //     new GammeModel("Mineur Mélodique", 7.ToString(), new List<Ecart>() {
        //         Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 0.5).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 0.5).FirstOrDefault(),
        //     }, ModeEnum.MineurMelodique),
        //      new GammeModel("Dorien B2", 8.ToString(), new List<Ecart>() {
        //         Ecarts.Where(e => e.Ton == 0.5).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 0.5).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //     }, ModeEnum.MineurMelodique),
        //     new GammeModel("Lydien aug.", 9.ToString(), new List<Ecart>() {
        //         Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 0.5).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 0.5).FirstOrDefault(),

        //     }, ModeEnum.MineurMelodique),
        //     new GammeModel("Lydien dom.", 10.ToString(), new List<Ecart>() {
        //         Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 0.5).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 0.5).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),

        //     }, ModeEnum.MineurMelodique),
        //     new GammeModel("Aeolien dom.", 11.ToString(), new List<Ecart>() {
        //         Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 0.5).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 0.5).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),

        //     }, ModeEnum.MineurMelodique),
        //     new GammeModel("Half dim.", 12.ToString(), new List<Ecart>() {
        //         Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 0.5).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 0.5).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),

        //     }, ModeEnum.MineurMelodique),
        //     new GammeModel("Alteré.", 13.ToString(), new List<Ecart>() {
        //         Ecarts.Where(e => e.Ton == 0.5).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 0.5).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //     }, ModeEnum.MineurMelodique),

        //     new GammeModel("Mineur harm.", 14.ToString(), new List<Ecart>() {
        //         Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 0.5).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 0.5).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 1.5).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 0.5).FirstOrDefault(),
        //     }, ModeEnum.MineurHarmonique),
        //     new GammeModel("Locrian #6.", 15.ToString(), new List<Ecart>() {
        //         Ecarts.Where(e => e.Ton == 0.5).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 0.5).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 1.5).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 0.5).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //     }, ModeEnum.MineurHarmonique),
        //     new GammeModel("Majeur #5.", 16.ToString(), new List<Ecart>() {
        //         Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 0.5).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 1.5).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 0.5).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 0.5).FirstOrDefault(),

        //     }, ModeEnum.MineurHarmonique),
        //     new GammeModel("Dorien #4.", 17.ToString(), new List<Ecart>() {
        //         Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 0.5).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 1.5).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 0.5).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 0.5).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //     }, ModeEnum.MineurHarmonique),
        //     new GammeModel("Phrygien Dom.", 18.ToString(), new List<Ecart>() {
        //         Ecarts.Where(e => e.Ton == 0.5).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 1.5).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 0.5).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 0.5).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //     }, ModeEnum.MineurHarmonique),
        //      new GammeModel("Lydien #2.", 19.ToString(), new List<Ecart>() {
        //         Ecarts.Where(e => e.Ton == 1.5).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 0.5).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 0.5).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 0.5).FirstOrDefault(),

        //     }, ModeEnum.MineurHarmonique),
        //      new GammeModel("Dom. Alt. bb7", 20.ToString(), new List<Ecart>() {
        //         Ecarts.Where(e => e.Ton == 0.5).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 0.5).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 0.5).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 1.5).FirstOrDefault(),
        //     }, ModeEnum.MineurHarmonique),

        //     new GammeModel("Majeur Harmonic", 21.ToString(), new List<Ecart>() {
        //         Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 0.5).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 0.5).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 1.5).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 0.5).FirstOrDefault(),
        //     }, ModeEnum.MajeurHarmonique),
        //     new GammeModel("Dorien b5", 22.ToString(), new List<Ecart>() {
        //         Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 0.5).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 0.5).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 1.5).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 0.5).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),

        //     }, ModeEnum.MajeurHarmonique),
        //     new GammeModel("Phrygien b4", 23.ToString(), new List<Ecart>() {
        //         Ecarts.Where(e => e.Ton == 0.5).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 0.5).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 1.5).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 0.5).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //     }, ModeEnum.MajeurHarmonique),
        //     new GammeModel("Lydien b3", 24.ToString(), new List<Ecart>() {
        //         Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 0.5).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 1.5).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 0.5).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 0.5).FirstOrDefault(),

        //     }, ModeEnum.MajeurHarmonique),
        //     new GammeModel("Myxolidien b3", 25.ToString(), new List<Ecart>() {
        //         Ecarts.Where(e => e.Ton == 0.5).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 1.5).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 0.5).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 0.5).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),

        //     }, ModeEnum.MajeurHarmonique),
        //     new GammeModel("Lydien aug. #2", 26.ToString(), new List<Ecart>() {
        //         Ecarts.Where(e => e.Ton == 1.5).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 0.5).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 0.5).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 0.5).FirstOrDefault(),


        //     }, ModeEnum.MajeurHarmonique),
        //     new GammeModel("Locrian bb7", 27.ToString(), new List<Ecart>() {
        //         Ecarts.Where(e => e.Ton == 0.5).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 0.5).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 1).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 0.5).FirstOrDefault(),
        //         Ecarts.Where(e => e.Ton == 1.5).FirstOrDefault(),
        //     }, ModeEnum.MajeurHarmonique),

        // };
    }
}