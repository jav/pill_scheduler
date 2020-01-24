export enum Substance {
    ACETYLICACID,
    DIKLOFENAK,
    IBUPROFEN,
    PARACETAMOL
}

export class Pill {
    pillName: string;
    activeSubstance: Substance;

    constructor(pill: string, activeSubstance: Substance) {
        this.pillName = pill;
        this.activeSubstance = activeSubstance;
    }

    isParacetamol = () => {
        return this.activeSubstance === Substance.PARACETAMOL;
    }

    isNSAID = () => {
        return this.activeSubstance !== Substance.PARACETAMOL
    }
}