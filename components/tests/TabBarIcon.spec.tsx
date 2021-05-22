import React from 'react';
import renderer from 'react-test-renderer';
import { TabBarIcon } from '../TabBarIcon';

describe('Component', () => {
  it(`TabBarIcon takes props correctly`, () => {
    const props = {
      name: 'home',
      focused: true,
    };
    expect(props.name).toEqual('home');
    expect(props.focused).toBeTruthy();
  });
})
