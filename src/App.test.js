import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import App from './App';

test('should be able to search and display dog breed results', () => {
  render(<App />);
  expect(screen.getByRole("heading")).toHaveTextContent(/Dogs Breed/);
});