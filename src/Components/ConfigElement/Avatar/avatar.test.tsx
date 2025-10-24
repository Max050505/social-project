import { describe, it, expect, vi } from "vitest";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { useAvatarAdd, useLoadingAvatar } from "../../../Utils/http";
import CustomRender from "../../../Utils/CustomRender";
import Avatar from "./Avatar";

vi.mock("firebase/auth", () => ({
  getAuth: vi.fn(() => ({ currentUser: { reload: vi.fn() } })),
  updateProfile: vi.fn().mockResolvedValue(undefined),
  onAuthStateChanged: vi.fn((_auth, cb) => {
    // immediately invoke callback to mark auth ready
    cb?.({ uid: "test-user" });
    return () => {};
  }),
}));
const mockMutateAsync = vi.fn().mockResolvedValue({
  downloadURL: "https://mock-avatar.com/avatar.png",
});
vi.mock("../../../Utils/http", async () => {
  const actual = await vi.importActual<typeof import("../../../Utils/http")>(
    "../../../Utils/http"
  );
  return {
    ...actual,
    useAvatarAdd: vi.fn(() => ({
      mutateAsync: mockMutateAsync})),
    useLoadingAvatar: vi.fn(() => ({
      data: "https://mock-avatar.com/avatar.png",
      refetch: vi.fn()
    })),
  };
});



describe("Testing avatar element of config page", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  it("render image and hidden input", () => {
    CustomRender(<Avatar />);
    const getImage = screen.getByAltText(/avatar/i);
    const getInput = screen.getByTestId(/avatar-input/i);
    expect(getImage).toBeInTheDocument();
    expect(getInput).toBeInTheDocument();
  });
  it("uploads avatar file and calls mutateAsync", async () => {
    (useAvatarAdd as ReturnType<typeof vi.fn>).mockReturnValue({
      mutateAsync: mockMutateAsync,
    });
    const mockRefetch = vi.fn();
    (useLoadingAvatar as ReturnType<typeof vi.fn>).mockReturnValue({
      data: "https://mock-avatar.com/avatar.png",
      refetch: mockRefetch,
    })
    CustomRender(<Avatar />);

    const input = screen.getByTestId(/avatar-input/i) as HTMLInputElement;
    const image = screen.getByAltText(/avatar/i)
    const file = new File(["avatar-bytes"], "avatar.png", { type: "image/png" });
    
    fireEvent.click(image);
    fireEvent.change(input, { target: {files: [file]}});
    
    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({file});
      expect(mockRefetch).toHaveBeenCalled();
    })
    expect(input).toBeInTheDocument();
    expect(image).toBeInTheDocument();
  });
  
});
