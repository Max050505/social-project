import { describe, it, expect, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { useAvatarAdd, useLoadingAvatar } from "../../../Utils/http";
import CustomRender from "../../../Utils/CustomRender";
import Avatar from "./Avatar";
import userEvent from "@testing-library/user-event";

vi.mock("../../../Utils/http", async () => {
  const actual = await vi.importActual<typeof import("../../../Utils/http")>(
    "../../../Utils/http"
  );
  return {
    ...actual,
    useAvatarAdd: vi.fn(() => ({
      mutateAsync: vi.fn().mockResolvedValue({}),
    })),
    useLoadingAvatar: vi.fn(),
  };
});



describe("Testing avatar element of config page", () => {
  it("render image and input", () => {
    CustomRender(<Avatar />);
    const getImage = screen.getByAltText(/avatar/i);
    const getInput = screen.getByTestId(/avatar-input/i);
    expect(getImage).toBeInTheDocument();
    expect(getInput).toBeInTheDocument();
  });
  it("Testing add avatar", async () => {
    const mockMutateAsync = vi.fn().mockResolvedValue({});
    (useAvatarAdd as ReturnType<typeof vi.fn>).mockReturnValue({
      mutateAsync: mockMutateAsync,
    });
    CustomRender(<Avatar />);

    const input = screen.getByTestId(/avatar-input/i) as HTMLInputElement;
    const image = screen.getByAltText(/avatar/i)
    const file = new File(["avatar-bytes"], "avatar.png", { type: "image/png" });
    await userEvent.upload(input, file);
    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalled();
    })
    expect('avatar.png').toBeInTheDocument();
    expect(image).toBeInTheDocument();
  });
});
