import React from 'react';
import renderer from 'react-test-renderer';

import {Pill, Substance} from '../../src/Types/Pill';

describe('Pill ', () => {
  it('isParacetamol() returns true on PARACETAMOL', () => {
    const pill = new Pill("name", Substance.PARACETAMOL);
    expect(pill.isParacetamol()).toEqual(true);
  });
  it('isParacetamol() returns false on IBUPROFEN', () => {
    const pill = new Pill("name", Substance.IBUPROFEN);
    expect(pill.isParacetamol()).toEqual(false);
  });
  it('isNSAID() returns false on PARACETAMOL', () => {
    const pill = new Pill("name", Substance.PARACETAMOL);
    expect(pill.isParacetamol()).toEqual(false);
  });
  it('isNSAID() returns true on IBUPROFEN', () => {
    const pill = new Pill("name", Substance.IBUPROFEN);
    expect(pill.isParacetamol()).toEqual(false);
  });
});
