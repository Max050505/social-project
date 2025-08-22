import CustomRender from "../../Utils/CustomRender";
import { screen, waitFor } from "@testing-library/react";
import { describe, vi, expect, it } from "vitest";
import RegistrationForm from "./RegistrationForm";
import { Route, Routes } from "react-router-dom";
import RegistrationPage from "../../Pages/RegistrationPage";
import AuthenticationPage from "../../Pages/AuthenticationPage";
import userEvent from "@testing-library/user-event";
import { registerUser } from "../../Utils/authService";
const navigateMock= vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock("../Utils/authService", async () => {
  const actual = await vi.importActual<typeof import("../../Utils/authService")>(
    "../Utils/authService"
  );
  return {
    ...actual,
    registerUser: vi.fn(),
  };
});

describe("Test RegistrationFrom element ", () => {
  it("testing registrationfrom input, button", async () => {
    (registerUser as ReturnType<typeof vi.fn>).mockResolvedValueOnce({});
    CustomRender(<RegistrationForm />);

    const firstNameInput = screen.getByTestId(/first-name/i);
    const lastNameInput = screen.getByTestId(/last-name/i);
    const emailInput = screen.getByTestId(/email/i);
    const passwordInput = screen.getByTestId('password');
    const confirmPasswordInput = screen.getByTestId(/confirm-password/i);
    const buttonElement = screen.getByRole("button", { name: /sign up/i });

    await userEvent.type(emailInput, "soth@example.com");
    await userEvent.type(passwordInput, "sum12345");
    await userEvent.type(firstNameInput, "John");
    await userEvent.type(lastNameInput, "Cooper");
    await userEvent.type(confirmPasswordInput, "sum12345");
    await waitFor(() => {
      expect(emailInput).toHaveValue("soth@example.com");
      expect(passwordInput).toHaveValue("sum12345");
      expect(firstNameInput).toHaveValue('John');
      expect(lastNameInput).toHaveValue('Cooper');
      expect(confirmPasswordInput).toHaveValue('sum12345');
    });
    await userEvent.click(buttonElement);

    expect(registerUser).toHaveBeenCalledWith(
      'soth@example.com', 'sum12345'
    )
  
    expect(navigateMock).toHaveBeenCalledWith('/welcome');
    expect(registerUser).toHaveBeenCalledTimes(1);
    navigateMock.mockClear();
    (registerUser as ReturnType<typeof vi.fn>).mockClear();
  });

  it("testing navigation to login page.", async () => {
    CustomRender(
      <Routes>
        <Route path="/" element={<AuthenticationPage />} />
        <Route path="/registration" element={<RegistrationPage />} />
      </Routes>,
      ["/registration"]
    );

    const navigateElement = screen.getByRole("link", { name: /Sign in/i });

    await userEvent.click(navigateElement);

    expect(await screen.findByText(/Login/i)).toBeInTheDocument();
  });
});
