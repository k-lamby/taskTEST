//================== LoginModal.test.js ===================//
// testing for the login modal and functionality
//========================================================//
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import LoginModal from '../components/LoginModal';
import { logIn } from '../services/authService';

jest.mock('../services/authService');
const mockNavigate = jest.fn();

describe('LoginModal component', () => {
  test('renders correctly', () => {
    const { getByPlaceholderText } = render(
      <LoginModal visible={true} onClose={() => {}} navigation={{ navigate: jest.fn() }} />
    );

    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
  });

  test('handles login correctly', async () => {
    const mockNavigate = jest.fn();
    const { getByPlaceholderText, getByText } = render(
      <LoginModal visible={true} onClose={jest.fn()} navigation={{ navigate: mockNavigate }} />
    );

    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'Test123!');
    fireEvent.press(getByText('Login'));

    expect(mockNavigate).toHaveBeenCalledWith('Summary');
  });
})