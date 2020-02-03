export enum SubstanceKey {
    ACETYLICACID,
    DIKLOFENAK,
    IBUPROFEN,
    PARACETAMOL
}

export class Substance {
    name: string;
    substanceKey: SubstanceKey;
    periodicity: number;
    maxDose24h: number;
    maxDose: number;

    constructor(_inObj: { name: string, substanceKey: SubstanceKey, periodicity: number, maxDose24h: number, maxDose: number }) {
        this.name = _inObj.name;
        this.substanceKey = _inObj.substanceKey;
        this.periodicity = _inObj.periodicity;
        this.maxDose24h = _inObj.maxDose24h;
        this.maxDose = _inObj.maxDose;
    }
}

class SubstanceDB {
    substanceDB: Substance[]

    constructor() {
        this.substanceDB = [
            new Substance({
                name: 'Acetylicacid',
                substanceKey: SubstanceKey.ACETYLICACID,
                maxDose: 1000,
                maxDose24h: 3000,
                periodicity: 6 * 60 * 60 * 1000
            }),
            new Substance({
                name: 'Diklofenak',
                substanceKey: SubstanceKey.DIKLOFENAK,
                maxDose: 50,
                maxDose24h: 150,
                periodicity: 6 * 60 * 60 * 1000
            }),
            new Substance({
                name: 'Ibuprofen',
                substanceKey: SubstanceKey.IBUPROFEN,
                maxDose: 400,
                maxDose24h: 1200,
                periodicity: 6 * 60 * 60 * 1000
            }),
            new Substance({
                name: 'Paracetamol',
                substanceKey: SubstanceKey.PARACETAMOL,
                maxDose: 1000,
                maxDose24h: 4000,
                periodicity: 4 * 60 * 60 * 1000
            })
        ]
    }

    getSubstanceByKey(_substance: SubstanceKey): Substance | undefined {
        const filteredList = this.substanceDB.filter((s) => s.substanceKey === _substance);
        if (filteredList.length <= 0)
            return null;
        return filteredList[0]
    }
}

export const substanceDB = new SubstanceDB();