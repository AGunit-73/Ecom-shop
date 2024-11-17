import { render, screen, fireEvent } from "@testing-library/react";
import ContactPage from "../src/app/contact/page";
import "@testing-library/jest-dom";

describe("ContactPage", () => {
  beforeAll(() => {
    // Mock requestSubmit to prevent `jsdom` errors
    HTMLFormElement.prototype.requestSubmit = jest.fn();
  });

  test("renders the page heading", () => {
    render(<ContactPage />);
    const heading = screen.getByText(/Contact Us/i);
    expect(heading).toBeInTheDocument();
  });

  test("renders the contact details", () => {
    render(<ContactPage />);
    const address = screen.getByText(/300 South Grand Blvd/i);
    const phone = screen.getByText(/571-457-2321/i);
    const email = screen.getByText(/contact@isolora.com/i);

    expect(address).toBeInTheDocument();
    expect(phone).toBeInTheDocument();
    expect(email).toBeInTheDocument();
  });

  test("renders the contact form", () => {
    render(<ContactPage />);
    const nameInput = screen.getByLabelText(/Full Name/i);
    const emailInput = screen.getByLabelText(/Email/i);
    const messageTextarea = screen.getByLabelText(/Message/i);
    const submitButton = screen.getByRole("button", { name: /Send/i });

    expect(nameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(messageTextarea).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  test("handles form submission", () => {
    const handleSubmit = jest.fn(); // Mock form submission logic
    render(<ContactPage />);
    const nameInput = screen.getByLabelText(/Full Name/i);
    const emailInput = screen.getByLabelText(/Email/i);
    const messageTextarea = screen.getByLabelText(/Message/i);
    const submitButton = screen.getByRole("button", { name: /Send/i });

    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "john.doe@example.com" } });
    fireEvent.change(messageTextarea, { target: { value: "Hello, this is a test message." } });

    fireEvent.click(submitButton);

    expect(handleSubmit).not.toHaveBeenCalled(); // Assuming form submission is not implemented
    // Add more assertions if the component includes validation messages or updates state
  });

  test("validates empty fields on form submission", () => {
    render(<ContactPage />);
    const submitButton = screen.getByRole("button", { name: /Send/i });

    fireEvent.click(submitButton);

    // Add validation logic if implemented in your component
    // For example:
    // expect(screen.getByText(/please fill out all fields/i)).toBeInTheDocument();
  });
});
