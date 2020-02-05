import React from 'react';
import renderer from 'react-test-renderer';

import moment from 'moment';

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
  it('add', () => {
    const admList = new AdministrationList();
    expect(admList.length()).toEqual(0);
    admList.addAdministration(admA);
    expect(admList.length()).toEqual(1);
    admList.addAdministration(admB);
    expect(admList.length()).toEqual(2);
  })

  it('getInterval()', () => {
    const admList = new AdministrationList([admA, admB, admC, admD, admE]);
    expect(admList.getInterval(timeSix, timeTwelve).length()).toEqual(1);
    const admListSingleAdm = new AdministrationList([admC]);
    expect(admList.getInterval(timeSix, timeTwelve)).toEqual(admListSingleAdm);
    expect(admList.getInterval(timeTwelve, timeSix)).toEqual(admListSingleAdm);
  });

  it('onlyNSAID()', () => {
    const admList = new AdministrationList([admA, admB, admC, admD, admE]);
    const admListOnlyNSAID = new AdministrationList([admB, admC, admD]);
    expect(admList.onlyNSAID()).toEqual(admListOnlyNSAID)
  });

  it('onlyParacetamol', () => {
    const admList = new AdministrationList([admA, admB, admC, admD, admE]);
    const admListOnlyParacetamol = new AdministrationList([admA, admE]);
    expect(admList.onlyParacetamol()).toEqual(admListOnlyParacetamol)
  });
});
