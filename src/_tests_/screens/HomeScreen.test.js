//================== HomeScreen.test.js ===================//
// testing for the homescreen
//========================================================//

//NOT YET BUILT OUT
import React from 'react';
import { render, screen } from '@testing-library/react-native';
import HomeScreen from '../src/screens/HomeScreen';

describe('HomeScreen', () => {
  test('renders welcome message correctly', () => {
    render(<HomeScreen />);
    expect(screen.getByText(/welcome/i)).toBeTruthy();
  });
});