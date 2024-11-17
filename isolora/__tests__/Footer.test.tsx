import { render, screen } from "@testing-library/react";
import Footer from "../src/app/footer/page";
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

    const homeLink = screen.getByText(/Home/i).closest("a");
    const aboutLink = screen.getByText(/About Us/i).closest("a");
    const contactLink = screen.getByText(/Contact/i).closest("a");

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
    render(<Footer />);

    // Check for SVG elements by using `svg` tag names
    const svgIcons = document.querySelectorAll("svg");
    expect(svgIcons).toHaveLength(3); // Expect 3 icons: Home, About Us, and Contact
  });
});
