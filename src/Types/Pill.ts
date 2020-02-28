import { SubstanceKey, substanceDB } from './Substance';

export class Pill {
    name: string;
    activeSubstance: SubstanceKey;
    doseList: number[];
    defaultDose: number;

    constructor(_inObj: { name: string, substance: SubstanceKey, doseList: number[], defaultDose: number }) {
        this.name = _inObj.name;
        this.activeSubstance = _inObj.substance;
        this.doseList = _inObj.doseList;
        this.defaultDose = _inObj.defaultDose;
    }

    isParacetamol = () => {
        return this.activeSubstance === SubstanceKey.PARACETAMOL;
    }

    isNSAID = () => {
        return this.activeSubstance !== SubstanceKey.PARACETAMOL
    }

    getEffectAtTime(timeTaken: Date, time: Date): number {
        return substanceDB.getSubstanceByKey(this.activeSubstance).getEffectAtTime(timeTaken, time);
    }
}

class PillsDB {
    pillsDB: Pill[];

    constructor() {
        this.pillsDB = [
            new Pill({
                name: 'Acetylicacid',
                substance: SubstanceKey.ACETYLICACID,
                doseList: [250, 500, 750, 1000, 1250, 1500, 1750, 2000],
                defaultDose: 1000
            }),
            new Pill({
                name: 'Diklofenak',
                substance: SubstanceKey.DIKLOFENAK,
                doseList: [25, 50, 75, 100],
                defaultDose: 25
            }),
            new Pill({
                name: 'Ibuprofen',
                substance: SubstanceKey.IBUPROFEN,
                doseList: [100, 200, 300, 400, 500, 600, 700, 800],
                defaultDose: 400,
            }),
            new Pill({
                name: 'Paracetamol',
                substance: SubstanceKey.PARACETAMOL,
                doseList: [250, 325, 500, 650, 750, 1000],
                defaultDose: 1000,
            })
        ]
    }

    getPill(_name): Pill | null {
        const filteredList = this.pillsDB.filter((p) => p.name === _name);
        if (filteredList.length <= 0)
            return null;
        return filteredList[0]
    }

    getAllParacetamol() {
        return this.pillsDB.filter((p) => p.activeSubstance === SubstanceKey.PARACETAMOL);
    }

    getAllNSAID() {
        return this.pillsDB.filter(
            (p) => [SubstanceKey.ACETYLICACID, SubstanceKey.DIKLOFENAK, SubstanceKey.IBUPROFEN].includes(p.activeSubstance));
    }
}

export const pillsDB = new PillsDB();