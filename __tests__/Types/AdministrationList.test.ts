import React from 'react';
import renderer from 'react-test-renderer';

import Administration from '../../src/Types/Administration';
import { Pill, Substance } from '../../src/Types/Pill';
import { exportAllDeclaration } from '@babel/types';
import AdministrationList from '../../src/Types/AdministrationList';


const timeZero = Date.parse('01 Jan 1970 00:00:00 GMT');
const timeSix = Date.parse('01 Jan 1970 06:00:00 GMT');
const timeTwelve = Date.parse('01 Jan 1970 12:00:00 GMT');
const timeEighteen = Date.parse('01 Jan 1970 18:00:00 GMT');
const timeTwentyFour = Date.parse('02 Jan 1970 00:00:00 GMT');

const pillA = new Pill("Generic", Substance.PARACETAMOL);
const pillB = new Pill("Generic", Substance.DIKLOFENAK);
const pillC = new Pill("Generic", Substance.ACETYLICACID);
const pillD = new Pill("Generic", Substance.IBUPROFEN);
const pillE = new Pill("Generic", Substance.PARACETAMOL);

const admA = new Administration(timeZero, pillA);
const admB = new Administration(timeSix, pillB);
const admC = new Administration(timeTwelve, pillC);
const admD = new Administration(timeEighteen, pillD);
const admE = new Administration(timeTwentyFour, pillE);


describe('AdministrationList', () => {
  it('getInterval()', () => {
    let admList = new AdministrationList([admA, admB, admC, admD, admE]);
    expect(admList.getInterval(timeSix, timeTwelve).length()).toEqual(1);
    let admListSingleAdm = new AdministrationList([admC]);
    expect(admList.getInterval(timeSix, timeTwelve)).toEqual(admListSingleAdm);
    expect(admList.getInterval(timeTwelve, timeSix)).toEqual(admListSingleAdm);
  });

  it('onlyNSAID()', () => {
    let admList = new AdministrationList([admA, admB, admC, admD, admE]);
    let admListOnlyNSAID = new AdministrationList([admB, admC, admD]);
    expect(admList.onlyNSAID()).toEqual(admListOnlyNSAID)
  });

  it('onlyParacetamol', () => {
    let admList = new AdministrationList([admA, admB, admC, admD, admE]);
    let admListOnlyParacetamol = new AdministrationList([admA, admE]);
    expect(admList.onlyParacetamol()).toEqual(admListOnlyParacetamol)
  });
});
