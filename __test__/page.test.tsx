import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import HomePage from "../app/page";
import { fireEvent } from "@testing-library/react";

describe("HomePage", () => {
  it("renders a heading", () => {
    render(<HomePage />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Welcome to Test Luna");
  });

  it("renders login and register buttons", () => {
    render(<HomePage />);
    const loginButton = screen.getByRole("button", { name: /ログイン/i });
    const registerButton = screen.getByRole("button", {
      name: /アカウント作成/i,
    });

    expect(loginButton).toBeInTheDocument();
    expect(registerButton).toBeInTheDocument();
  });

  it("navigates to login page on login button click", () => {
    render(<HomePage />);
    const loginButton = screen.getByRole("button", { name: /ログイン/i });

    fireEvent.click(loginButton);

    expect(loginButton.closest("a")).toHaveAttribute("href", "/auth/login");
  });

  it("navigates to register page on register button click", () => {
    render(<HomePage />);
    const registerButton = screen.getByRole("button", {
      name: /アカウント作成/i,
    });

    fireEvent.click(registerButton);

    expect(registerButton.closest("a")).toHaveAttribute(
      "href",
      "/auth/register"
    );
  });
});
