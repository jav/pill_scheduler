import React from 'react';
import renderer from 'react-test-renderer';

import { describe, it, expect } from 'jest';

import moment from 'moment';

import Administration from '../../src/Types/Administration';
import { pillsDB, Pill } from '../../src/Types/Pill';
import { SubstanceKey } from '../../src/Types/Substance';
import { exportAllDeclaration } from '@babel/types';
import AdministrationList from '../../src/Types/AdministrationList';


const timeZero = new Date('01 Jan 1970 00:00:00 GMT');
const timeSix = new Date('01 Jan 1970 06:00:00 GMT');
const timeTwelve = new Date('01 Jan 1970 12:00:00 GMT');
const timeEighteen = new Date('01 Jan 1970 18:00:00 GMT');
const timeTwentyFour = new Date('02 Jan 1970 00:00:00 GMT');

const pillA = pillsDB.getPill("Paracetamol");
const pillB = pillsDB.getPill("Diklofenak");
const pillC = pillsDB.getPill("Acetylicacid");
const pillD = pillsDB.getPill("Ibuprofen");
const pillE = pillsDB.getPill("Paracetamol");

const admA = new Administration(timeZero, pillA, 500);
const admB = new Administration(timeSix, pillB, 50);
const admC = new Administration(timeTwelve, pillC, 1000);
const admD = new Administration(timeEighteen, pillD, 400);
const admE = new Administration(timeTwentyFour, pillE, 500);


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

  it('getEffectAtTime', () => {
    const admListA = new AdministrationList([admA]);
    let sampleTimeA = timeZero.getTime() + (0.5*60*60*1000); // +30 min for max effect
    expect(admListA.getEffectAtTime(sampleTimeA, 'Paracetamol')).toBeCloseTo(1);

    const admListB = new AdministrationList([admA, admB, admC, admD, admE]);
    const sampleTimeB = timeZero.getTime() + (1.5*60*60*1000); // 1.30 min for 0.5 effect
    expect(admListB.getEffectAtTime(sampleTimeB, 'Paracetamol')).toBeCloseTo(0.5);

    const timeOne = timeZero.getTime() + (1*60*60*1000);
    const admListC = new AdministrationList([admA, new Administration(timeOne, pillA, 1000)]);
    const sampleTimeC = timeZero.getTime() + (2.5*60*60*1000); // 1.30 min for 0.5 effect
    expect(admListC.getEffectAtTime(sampleTimeC, 'Paracetamol')).toBeCloseTo(0.75);
  });
});
