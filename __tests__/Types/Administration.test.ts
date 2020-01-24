import React from 'react';
import renderer from 'react-test-renderer';

import Administration from '../../src/Types/Administration';
import {Pill, Substance} from '../../src/Types/Pill';
import { exportAllDeclaration } from '@babel/types';

describe('Administration ', () => {
  it('??', () => {
    const pill = new Pill("name", Substance.PARACETAMOL);
    expect(true).toEqual(true);
  });
});
