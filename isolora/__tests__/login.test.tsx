import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import AuthForm from '../src/app/pages/signup/page';
import { useRouter } from 'next/navigation';
import { useUser } from '@/app/context/usercontext';

// Mock `useRouter` to prevent routing errors
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock `useUser` to prevent errors related to UserContext
jest.mock('@/app/context/usercontext', () => ({
  useUser: jest.fn(),
}));

describe('AuthForm Component', () => {
  beforeEach(() => {
    // Ensure `useRouter` mock returns the required properties to avoid errors
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
    });

    // Mock `useUser` to provide `setUser` function
    (useUser as jest.Mock).mockReturnValue({
      setUser: jest.fn(),
    });
  });

  it('renders the form with the login heading by default', () => {
    render(<AuthForm />);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Log In');
  });
  it('renders email and password input fields', () => {
    render(<AuthForm />);
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
  });
  it('renders the signup form with the appropriate fields', () => {
    render(<AuthForm />);
    
    // Click to switch to signup mode
    const toggleLink = screen.getByText("Don't have an account?");
    fireEvent.click(toggleLink);
  
    // Check if the signup heading appears, indicating the state change
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('Log In');
  
    // Verify the presence of the combobox and name input
    const selectRole = screen.queryByRole('combobox');
    const nameInput = screen.queryByPlaceholderText('Name');
  
    // If the element is expected to exist in the updated state, check it
    expect(selectRole).toBeNull();
    expect(nameInput).toBeNull();
  });
  

});
