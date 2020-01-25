import React from 'react';
import renderer from 'react-test-renderer';

import Administration from '../../src/Types/Administration';
import {Pill, Substance} from '../../src/Types/Pill';
import { exportAllDeclaration } from '@babel/types';
import AdministrationList from '../../src/Types/AdministrationList';


const timeZero = Date.parse('01 Jan 1970 00:00:00 GMT');
const timeSix = Date.parse('01 Jan 1970 06:00:00 GMT');
const timeTwelve = Date.parse('01 Jan 1970 12:00:00 GMT');
const timeEighteen = Date.parse('01 Jan 1970 18:00:00 GMT');
const timeTwentyFour = Date.parse('02 Jan 1970 00:00:00 GMT');

const pillA = new Pill(Substance.PARACETAMOL);
const pillB = new Pill(Substance.DIKLOFENAK);
const pillC = new Pill(Substance.ACETYLICACID);
const pillD = new Pill(Substance.IBUPROFEN);
const pillE = new Pill(Substance.PARACETAMOL);

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
});
