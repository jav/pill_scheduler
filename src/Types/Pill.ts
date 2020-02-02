export enum Substance {
    ACETYLICACID,
    DIKLOFENAK,
    IBUPROFEN,
    PARACETAMOL
}


export class Pill {
    name: string;
    activeSubstance: Substance;
    doseList: number[];
    defaultDose: number;

    constructor(_inObj: { name: string, substance: Substance, doseList: number[], defaultDose: number }) {
        this.name = _inObj.name;
        this.activeSubstance = _inObj.substance;
        this.doseList = _inObj.doseList;
        this.defaultDose = _inObj.defaultDose;
    }

    isParacetamol = () => {
        return this.activeSubstance === Substance.PARACETAMOL;
    }

    isNSAID = () => {
        return this.activeSubstance !== Substance.PARACETAMOL
    }
}

class PillsDB {
    pillsDB: Pill[];

    constructor() {
        this.pillsDB = [
            new Pill({
                name: 'Acetylicacid',
                substance: Substance.ACETYLICACID,
                doseList: [250, 500, 750, 1000, 1250, 1500, 1750, 2000],
                defaultDose: 1000
            }),
            new Pill({
                name: 'Diklofenak',
                substance: Substance.DIKLOFENAK,
                doseList: [25, 50, 75, 100],
                defaultDose: 25
            }),
            new Pill({
                name: 'Ibuprofen',
                substance: Substance.IBUPROFEN,
                doseList: [100, 200, 300, 400, 500, 600, 700, 800],
                defaultDose: 400
            }),
            new Pill({
                name: 'Paracetamol',
                substance: Substance.PARACETAMOL,
                doseList: [250, 325, 500, 650, 750, 1000],
                defaultDose: 1000
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
        return this.pillsDB.filter((p) => p.substance === Substance.PARACETAMOL);
    }

    getAllNSAID() {
        console.log("getAllNSAID() will return: ", this.pillsDB.filter(
            (p) => [Substance.ACETYLICACID, Substance.DIKLOFENAK, Substance.IBUPROFEN].includes(p.activeSubstance))
        );
        console.log("having filtered the list:", this.pillsDB);
        return this.pillsDB.filter(
            (p) => [Substance.ACETYLICACID, Substance.DIKLOFENAK, Substance.IBUPROFEN].includes(p.activeSubstance));
    }
}

export const pillsDB = new PillsDB();