import { ScaleMold } from "../obj/scale.mold";

export const SCALE_SHAPES : ScaleMold[] = [{
    code: "SS01",
    english: "Majeur",
    latin: "Majeur",tone: 0,
    tons: [1, 1, 0.5, 1, 1, 1, 0.5]
},
{
    code: "SS02",
    english: "Majeur harmonique",
    latin: "Majeur harmonique",tone: 0,
    tons: [1, 1, 0.5, 1, 0.5, 1.5, 0.5]
    },
    {
        code: "SS03",
        english: "Mineur mélodique",
        latin: "Mineur mélodique",tone: 0,
            tons: [1, 0.5, 1, 1, 1, 1, 0.5]
    },
    {
        code: "SS04",
        english: "Mineur harmonique",
        latin: "Mineur harmonique",tone: 0,
        tons: [1, 0.5, 1, 1, 0.5, 1.5, 0.5]
    }
]