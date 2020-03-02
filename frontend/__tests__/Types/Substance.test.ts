import React from 'react';

import { substanceDB, SubstanceKey } from '../../src/Types/Substance';

describe('Substance', () => {
    it('getEffectAtTime', () => {
        const takenTime = new Date("2000-01-01T00:00:00Z");
        const minute15 = new Date("2000-01-01T00:15:00Z");
        const minute30 = new Date("2000-01-01T00:30:00Z");
        const minute90 = new Date("2000-01-01T01:30:00Z");
        const minute150 = new Date("2000-01-01T02:30:00Z");

        const paracetamol = substanceDB.getSubstanceByKey(SubstanceKey.PARACETAMOL)
        expect(paracetamol.getEffectAtTime(takenTime, takenTime)).toBeCloseTo(0);
        expect(paracetamol.getEffectAtTime(takenTime, minute15)).toBeCloseTo(0.5);
        expect(paracetamol.getEffectAtTime(takenTime, minute30)).toBeCloseTo(1);
        expect(paracetamol.getEffectAtTime(takenTime, minute90)).toBeCloseTo(0.5);
        expect(paracetamol.getEffectAtTime(takenTime, minute150)).toBeCloseTo(0.25);

    });

});
