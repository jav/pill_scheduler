import React from 'react';
import renderer from 'react-test-renderer';

import { pillsDB, Pill } from '../../src/Types/Pill';

describe('Pill ', () => {
  it('isParacetamol() returns true on PARACETAMOL', () => {
    const pill = pillsDB.getPill('Paracetamol');
    expect(pill.isParacetamol()).toEqual(true);
  });
  it('isParacetamol() returns false on IBUPROFEN', () => {
    const pill = pillsDB.getPill('Ibuprofen');
    expect(pill.isParacetamol()).toEqual(false);
  });
  it('isNSAID() returns false on PARACETAMOL', () => {
    const pill = pillsDB.getPill('Paracetamol');
    expect(pill.isNSAID()).toEqual(false);
  });
  it('isNSAID() returns true on IBUPROFEN', () => {
    const pill = pillsDB.getPill('Ibuprofen');
    expect(pill.isParacetamol()).toEqual(false);
  });
});
