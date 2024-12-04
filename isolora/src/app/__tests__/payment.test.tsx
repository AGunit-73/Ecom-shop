import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import CheckoutPage from "../checkout/page";
import { useUser } from "../context/usercontext";
import { useCart } from "../context/cartcontext";

jest.mock("../context/usercontext", () => ({
  useUser: jest.fn(),
}));

jest.mock("../context/cartcontext", () => ({
  useCart: jest.fn(),
}));

global.fetch = jest.fn();

beforeAll(() => {
  window.alert = jest.fn(); // Mock alert globally
});

describe("Checkout Page", () => {
  test("displays loading state initially", () => {
    (useUser as jest.Mock).mockReturnValue({ user: { id: 1, name: "John Doe" } });
    (useCart as jest.Mock).mockReturnValue({ clearCart: jest.fn() });

    render(<CheckoutPage />);
    expect(screen.getByText("Loading your cart...")).toBeInTheDocument();
  });

  test("displays error when cart fetch fails", async () => {
    (useUser as jest.Mock).mockReturnValue({ user: { id: 1 } });
    (useCart as jest.Mock).mockReturnValue({ clearCart: jest.fn() });

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Failed to fetch cart data." }),
    });

    render(<CheckoutPage />);
    expect(await screen.findByText("Failed to fetch cart data.")).toBeInTheDocument();
  });

  test("handles successful order placement", async () => {
    // Mock user and cart contexts
    (useUser as jest.Mock).mockReturnValue({
      user: { id: 1, name: "John Doe", email: "john.doe@example.com" },
    });
    (useCart as jest.Mock).mockReturnValue({ clearCart: jest.fn() });

    // Mock API calls
    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          cartItems: [
            {
              cartid: 1,
              name: "Item 1",
              quantity: 2,
              price: 20,
              image_url: "http://example.com/image.jpg",
              product_id: 101,
              vendor_id: 201,
            },
          ],
        }),
      }) // Mock cart fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }), // Mock order placement
      });

    render(<CheckoutPage />);

    // Wait for the "Confirm Order" button
    const confirmOrderButton = await screen.findByText("Confirm Order");
    expect(confirmOrderButton).toBeInTheDocument();

    // Fill in the shipping address
    fireEvent.change(screen.getByPlaceholderText("Address Line 1"), {
      target: { value: "123 Test St" },
    });
    fireEvent.change(screen.getByPlaceholderText("City"), { target: { value: "Test City" } });
    fireEvent.change(screen.getByPlaceholderText("State"), { target: { value: "Test State" } });
    fireEvent.change(screen.getByPlaceholderText("Country"), { target: { value: "Test Country" } });
    fireEvent.change(screen.getByPlaceholderText("Zip Code"), { target: { value: "12345" } });

    // Click "Confirm Order" button
    fireEvent.click(confirmOrderButton);

    // Wait for the order confirmation message
    await waitFor(() => {
      expect(screen.getByText("Order Confirmed!")).toBeInTheDocument();
    });
  });
});
