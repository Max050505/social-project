import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import AuthForm from './AuthForm';


describe('Testing AuthForm component', () => {
  it('renders photo', () => {
    render(<AuthForm/>);
    const image = screen.getByAltText(/login-photo/i);
    expect(image).toBeInTheDocument();
  });

  it('renders title', () => {
    render(<AuthForm />);
    const title = screen.getByTitle(/login/i);
    expect(title).toBeInTheDocument();
  });

  it('renders inputs and allows typing', async () => {
    render(<AuthForm />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await userEvent.type(emailInput, 'some@example.com');
    await userEvent.type(passwordInput, 'something1111');

    expect(emailInput).toHaveValue('some@example.com');
    expect(passwordInput).toHaveValue('something1111');
  });
});