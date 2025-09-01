import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import AuthForm from "./AuthForm";
import CustomRender from "../../Utils/CustomRender";
import { signInUser } from "../../Utils/authService";
import { Route, Routes } from "react-router-dom";
import RegistrationPage from "../../Pages/RegistrationPage";
import AuthenticationPage from "../../Pages/AuthenticationPage";
import { useCurrentUser } from "../../Utils/http";

vi.mock("../../Utils/authService", async () => {
  const actual = await vi.importActual<typeof import("../../Utils/authService")>(
    "../../Utils/authService"
  );
  return {
    ...actual,
    signInUser: vi.fn(),
  };
});

vi.mock("../../Utils/http", async () => {
  const actual = await vi.importActual<typeof import("../../Utils/http")>(
    "../../Utils/http"
  );
  return {
    ...actual,
    useCurrentUser: vi.fn(() => ({
      isLoading: false,
      data: null,
    })),
  };
});

const navigateMock = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

describe("Testing AuthForm component", () => {
  it("renders photo", () => {
    CustomRender(<AuthForm />);
    const image = screen.getByAltText(/login-photo/i);
    expect(image).toBeInTheDocument();
  });

  it("renders title", () => {
    CustomRender(<AuthForm />);
    const title = screen.getByText(/login/i);
    expect(title).toBeInTheDocument();
  });

  it("fills and submit the form", async () => {
    const mockSignInUser = vi.fn().mockResolvedValue({});
    (signInUser as ReturnType<typeof vi.fn>).mockImplementation(mockSignInUser);
    
    CustomRender(<AuthForm />);
    const emailInput = screen.getByTestId(/email/i);
    const passwordInput = screen.getByTestId(/password/i);
    const buttonElement = screen.getByRole("button", { name: /sign in/i });

    await userEvent.type(emailInput, "some@example.com");
    await userEvent.type(passwordInput, "something1111");
    
    await waitFor(() => {
      expect(emailInput).toHaveValue("some@example.com");
      expect(passwordInput).toHaveValue("something1111");
    })
    await userEvent.click(buttonElement);

    expect(mockSignInUser).toHaveBeenCalledWith(
      "some@example.com",
      "something1111"
    );
    expect(navigateMock).toHaveBeenCalledWith("/welcome");
    expect(mockSignInUser).toHaveBeenCalledTimes(1);
    navigateMock.mockClear();
    (signInUser as ReturnType<typeof vi.fn>).mockClear();
  });

  it("Check the navigate link 'sign up'.", async () => {
    CustomRender(
      <Routes>
        <Route path="/" element={<AuthenticationPage />} />
        <Route path="/registration" element={<RegistrationPage />} />
      </Routes>
    );
    const navigateElement = screen.getByRole("link", { name: /Sign up/i });

    await userEvent.click(navigateElement);

    expect(screen.getByText(/account/i)).toBeInTheDocument();
  });
});
