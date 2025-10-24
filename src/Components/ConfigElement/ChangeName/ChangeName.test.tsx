import { describe, it, expect, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { useChangeName } from "../../../Utils/http";
import CustomRender from "../../../Utils/CustomRender";
import ChangeName from "./ChangeName";
import userEvent from "@testing-library/user-event";

vi.mock("../../../Utils/http", async () => {
  const actual = await vi.importActual<typeof import("../../../Utils/http")>(
    "../../../Utils/http"
  );
  return {
    ...actual,
    useChangeName: vi.fn(() => ({
      mutateAsync: vi.fn().mockResolvedValue({}),
    })),
  };
});

describe("Testing changeName element of config page", () => {
  it("render h3 as text", () => {
    CustomRender(<ChangeName />);
    const getTexth3 = screen.getByText("change name", { exact: false });
    expect(getTexth3).toBeInTheDocument();
  });

  it("testing form email, password and button", async () => {
    const mockMutateAsync = vi.fn().mockResolvedValue({});
    (useChangeName as ReturnType<typeof vi.fn>).mockReturnValue({
      mutateAsync: mockMutateAsync,
    });

    CustomRender(<ChangeName />);
    

    const card = screen.getByText("If you you want to change name, click here");
    await userEvent.click(card);

    const newFirstName = screen.getByTestId("newFirstName");
    const newLastName = screen.getByTestId("newLastName");
    const buttonElement = screen.getByRole("button", { name: /Save/i });

    await userEvent.type(newFirstName, "Jahn");
    await userEvent.type(newLastName, "Cooper");
    await waitFor(() => {
      expect(newFirstName).toHaveValue("Jahn");
      expect(newLastName).toHaveValue("Cooper");
    });
    await userEvent.click(buttonElement);
    
    expect(mockMutateAsync).toHaveBeenCalledWith({
      firstName: 'Jahn',
      lastName: 'Cooper'
    });
    expect(mockMutateAsync).toHaveBeenCalledOnce();
    (useChangeName as ReturnType<typeof vi.fn>).mockClear();
  });
});
