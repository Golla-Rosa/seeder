import { ChordGap } from "../obj/chord.gap";
import { ScaleGap } from "../obj/scale.gap";

export const SCALE_SHAPES : ScaleGap[] = [{
    code: "SS01",
    libelleProvisoire: "Majeur",
    tons: [1, 1, 0.5, 1, 1, 1, 0.5]
},
{
    code: "SS02",
    libelleProvisoire: "Majeur harmonique",
    tons: [1, 1, 0.5, 1, 0.5, 1.5, 0.5]
    },
    {
        code: "SS03",
        libelleProvisoire: "Mineur Melodique",
        tons: [1, 0.5, 1, 1, 1, 1, 0.5]
    },
    {
        code: "SS04",
        libelleProvisoire: "Mineur Harmonique",
        tons: [1, 0.5, 1, 1, 0.5, 1.5, 0.5]
    }
]