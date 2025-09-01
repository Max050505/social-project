import { describe, it, expect, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { useChangePassword } from "../../../Utils/http";
import CustomRender from "../../../Utils/CustomRender";
import ChangePasswordAndEmail from "./ChangePasswordAndEmail";
import userEvent from "@testing-library/user-event";

vi.mock("../../../Utils/http", async () => {
  const actual = await vi.importActual<typeof import("../../../Utils/http")>(
    "../../../Utils/http"
  );
  return {
    ...actual,
    useChangePassword: vi.fn(() => ({
      mutateAsync: vi.fn().mockResolvedValue({}),
    })),
  };
});

vi.mock("../Utils/http", () => ({
  handleVerify: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("../../../firebase", () => ({
  auth: {
    currentUser: {
      email: "test@example.com",
      providerData: [
        {
          providerId: "password",
        },
      ],
    },
  },
}));

describe("Testing changePasswordAndEmail component of config page", () => {
  it("render h3 element as text", async () => {
    CustomRender(<ChangePasswordAndEmail />);
    const getTexth3 = screen.getByText("change password", { exact: false });
    expect(getTexth3).toBeInTheDocument();
  });

  it("testing form email and password, button confirm", async () => {
    const mockMutateAsync = vi.fn().mockResolvedValue({});
    (useChangePassword as ReturnType<typeof vi.fn>).mockReturnValue({
      mutateAsync: mockMutateAsync,
    });
    
    CustomRender(<ChangePasswordAndEmail />);

    const card = screen.getByText("If you you want to change password, click here");
    await userEvent.click(card);

    const email = screen.getByTestId("email");
    const oldPassword = screen.getByTestId("oldPassword");
    const confirmButton = screen.getByRole("button", { name: /confirm/i });

    await userEvent.type(email, "bmaksumiv@i.ua");
    await userEvent.type(oldPassword, "111111");
    await waitFor(() => {
      expect(email).toHaveValue("bmaksumiv@i.ua");
      expect(oldPassword).toHaveValue("111111");
    });
    await userEvent.click(confirmButton);

    
    const newPassword = screen.getByTestId("newPassword");
    const saveButton = screen.getByRole("button", { name: /save/i });

    await userEvent.type(newPassword, "000000");
    await waitFor(() => {
      expect(newPassword).toHaveValue("000000");
    });
    await userEvent.click(saveButton);
    
    expect(mockMutateAsync).toHaveBeenCalledWith({
      email: "bmaksumiv@i.ua",
      oldPassword: "111111",
      newPassword: "000000",
    });
    expect(mockMutateAsync).toHaveBeenCalledOnce();
    (useChangePassword as ReturnType<typeof vi.fn>).mockClear();
  });
});
