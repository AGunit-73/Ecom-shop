import { render, screen, waitFor, act } from "@testing-library/react";
import CheckoutPage from "@/app/checkout/page";
import { useUser } from "@/app/context/usercontext";

// Mock the `useUser` hook
jest.mock("@/app/context/usercontext", () => ({
  useUser: jest.fn(),
}));

// Mock the `CheckoutForm` component
jest.mock("@/app/components/CheckoutForm", () => () => (
  <div data-testid="mock-checkout-form" />
));

describe("CheckoutPage Component", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear any previous mocks
  });

  test("renders the loading state initially", () => {
    // Mock `useUser` to return a logged-in user
    (useUser as jest.Mock).mockReturnValue({ user: { id: "123" } });

    // Mock `fetch` to simulate a pending state
    global.fetch = jest.fn(() => new Promise(() => {})); // Simulate pending fetch

    render(<CheckoutPage />);
    expect(screen.getByText(/loading your cart/i)).toBeInTheDocument();
  });

  test("displays an error message if the user is not logged in", async () => {
    // Mock `useUser` to return null (user not logged in)
    (useUser as jest.Mock).mockReturnValue({ user: null });

    render(<CheckoutPage />);

    await waitFor(() => {
      expect(screen.getByText(/user not logged in/i)).toBeInTheDocument();
    });
  });

  test("displays cart items when they are available", async () => {
    // Mock `useUser` to return a logged-in user
    (useUser as jest.Mock).mockReturnValue({ user: { id: "123" } });

    // Mock `fetch` to return cart items
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            success: true,
            cartItems: [{ id: 1, name: "Test Item", quantity: 2, price: 25 }],
          }),
      } as Response)
    );

    render(<CheckoutPage />);

    await waitFor(() => {
      // Validate cart item name
      expect(screen.getByText(/test item/i)).toBeInTheDocument();
      // Validate cart item quantity
      expect(screen.getByText(/\$25\.00\s+x\s+2/i)).toBeInTheDocument();
    });
  });

  test("renders payment success message when payment is successful", async () => {
    // Mock `useUser` to return a logged-in user
    (useUser as jest.Mock).mockReturnValue({ user: { id: "123" } });

    // Render the component
    render(<CheckoutPage />);

    // Simulate payment success
    act(() => {
      render(
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-pink-100 to-blue-100">
          <h2 className="text-xl font-bold text-green-600">Payment Successful!</h2>
          <p className="text-gray-700 mt-4">
            Thank you for your purchase! Your order will be processed soon.
          </p>
        </div>
      );
    });

    // Validate payment success message
    expect(screen.getByText(/payment successful!/i)).toBeInTheDocument();
    expect(screen.getByText(/thank you for your purchase!/i)).toBeInTheDocument();
    expect(
      screen.getByText(/your order will be processed soon/i)
    ).toBeInTheDocument();
  });
});
