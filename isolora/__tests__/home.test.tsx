import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Home from '../src/app/page';
import { useRouter } from 'next/router';

// Mock `useRouter` to prevent routing errors
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

// Mock `Header` and `ItemList` components
jest.mock('../src/app/components/header', () => () => <div data-testid="header-component">Header</div>);
jest.mock('../src/app/components/itemsList', () => () => <div data-testid="item-list-component">ItemList</div>);

describe('Home Page', () => {
  beforeEach(() => {
    // Ensure `useRouter` mock returns the required properties to avoid errors
    (useRouter as jest.Mock).mockReturnValue({
      pathname: '/',
      push: jest.fn(),
      replace: jest.fn(),
      query: {},
    });
  });

  it('renders the Header component', () => {
    render(<Home />);
    const header = screen.getByTestId('header-component');
    expect(header).toBeInTheDocument();
  });

  it('renders the main heading', () => {
    render(<Home />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Welcome to Isolora');
  });

  it('renders the ItemList component', () => {
    render(<Home />);
    const itemList = screen.getByTestId('item-list-component');
    expect(itemList).toBeInTheDocument();
  });
});
