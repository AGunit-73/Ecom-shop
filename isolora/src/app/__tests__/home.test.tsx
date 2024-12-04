import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import Home from '../page';
import { useRouter } from 'next/router';

// Mock `useRouter` to prevent routing errors
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

// Mock `Header` and `ItemList` components with display names
jest.mock('@/app/components/header', () => {
  const Header = () => <div data-testid="header-component">Header</div>;
  Header.displayName = 'Header'; // Add display name
  return Header;
});

jest.mock('@/app/components/itemsList', () => {
  const ItemList = ({ selectedCategory }: { selectedCategory: string }) => (
    <div data-testid="item-list-component">{`ItemList - Category: ${selectedCategory}`}</div>
  );
  ItemList.displayName = 'ItemList'; // Add display name
  return ItemList;
});

// Mock `HeroSwiper` to ignore it in the test
jest.mock('@/app/components/heroSwiper', () => {
  const HeroSwiper = () => <div data-testid="hero-swiper-component">Mocked HeroSwiper</div>;
  HeroSwiper.displayName = 'HeroSwiper';
  return HeroSwiper;
});

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

  // Mock `scrollIntoView` to prevent errors during tests
  beforeAll(() => {
    HTMLElement.prototype.scrollIntoView = jest.fn();
  });

  it('renders the Header component', () => {
    render(<Home />);
    const header = screen.getByTestId('header-component');
    expect(header).toBeInTheDocument();
  });

  it('renders the category navbar with correct categories', () => {
    render(<Home />);
    const categories = ['All', 'Indian Wear', 'Western Wear', 'Footwear'];
    categories.forEach((category) => {
      const button = screen.getByRole('button', { name: category });
      expect(button).toBeInTheDocument();
    });
  });

  it('changes the selected category when a category button is clicked', () => {
    render(<Home />);
    const categoryButton = screen.getByRole('button', { name: 'Indian Wear' });

    // Click on the "Indian Wear" category button
    fireEvent.click(categoryButton);

    // Check that the "Indian Wear" button is selected
    expect(categoryButton).toHaveClass('bg-blue-600 text-white');

    // Check that other buttons are not selected
    const allButton = screen.getByRole('button', { name: 'All' });
    expect(allButton).not.toHaveClass('bg-blue-600 text-white');
  });

  it('renders the ItemList component with the selected category', () => {
    render(<Home />);
    const categoryButton = screen.getByRole('button', { name: 'Footwear' });

    // Click on the "Footwear" category button
    fireEvent.click(categoryButton);

    // Verify that ItemList displays the correct category
    const itemList = screen.getByTestId('item-list-component');
    expect(itemList).toHaveTextContent('ItemList - Category: Footwear');
  });

  it('smoothly scrolls to the ItemList when a category is selected', () => {
    render(<Home />);
    const categoryButton = screen.getByRole('button', { name: 'Footwear' });

    // Click on the "Footwear" category button
    fireEvent.click(categoryButton);

    // Ensure `scrollIntoView` was called
    expect(HTMLElement.prototype.scrollIntoView).toHaveBeenCalled();
  });
});
