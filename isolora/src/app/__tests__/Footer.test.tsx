import { render, screen } from "@testing-library/react";
import Footer from "../footer/page";
import "@testing-library/jest-dom";

describe("Footer Component", () => {
  it("renders the navigation icons with correct text", () => {
    render(<Footer />);

    const homeLink = screen.getByText(/Home/i);
    const aboutLink = screen.getByText(/About Us/i);
    const contactLink = screen.getByText(/Contact/i);

    expect(homeLink).toBeInTheDocument();
    expect(aboutLink).toBeInTheDocument();
    expect(contactLink).toBeInTheDocument();
  });

  it("checks the navigation links' href attributes", () => {
    render(<Footer />);

    const homeLink = screen.getByRole("link", { name: /Home/i });
    const aboutLink = screen.getByRole("link", { name: /About Us/i });
    const contactLink = screen.getByRole("link", { name: /Contact/i });

    expect(homeLink).toHaveAttribute("href", "/");
    expect(aboutLink).toHaveAttribute("href", "/about");
    expect(contactLink).toHaveAttribute("href", "/contact");
  });

  it("renders the copyright section", () => {
    render(<Footer />);

    const copyright = screen.getByText(/©/i);
    const currentYear = new Date().getFullYear();

    expect(copyright).toBeInTheDocument();
    expect(copyright).toHaveTextContent(`© ${currentYear} Team Isolora. All Rights Reserved.`);
  });

  it("renders all navigation icons", () => {
    const { container } = render(<Footer />);

    // Use getElementsByTagName to select all SVG elements inside the rendered container
    const svgIcons = container.getElementsByTagName("svg");

    expect(svgIcons).toHaveLength(3); // Expect 3 icons: Home, About Us, and Contact
  });
});
