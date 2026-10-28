import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from './LoginPage';

jest.mock('../services/AuthService', () => ({
  login: jest.fn(() => Promise.resolve({ accessToken: 'test' })),
}));

test('renders login form fields', () => {
  render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>
  );

  // Форма логина содержит два input + кнопку
  const inputs = screen.getAllByRole('textbox');
  expect(inputs.length).toBeGreaterThanOrEqual(1);

  const passwordInput = document.querySelector('input[type="password"]');
  expect(passwordInput).toBeInTheDocument();
});