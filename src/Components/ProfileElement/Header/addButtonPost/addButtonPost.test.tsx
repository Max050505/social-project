
import { describe, it, expect, vi } from "vitest";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import CustomRender from "../../../../Utils/CustomRender";
import { fetchPost } from "../../../../Utils/profileHttp";
import AddButtonPost from "./AddButtonPost";
import { auth } from "../../../../firebase";
import { updateProfile } from "firebase/auth";


vi.mock("antd", async (importOriginal) => {
  const actual = await importOriginal<typeof import("antd")>();
  return {
    ...actual,

    message: {
      useMessage: () => [
        {
          open: vi.fn(),
          success: vi.fn(),
          error: vi.fn(),
          info: vi.fn(),
          warning: vi.fn(),
        },
        <div key="context-holder">context-holder</div>,
      ],
    },

    Spin: ({ children }: { children?: React.ReactNode }) => (
      <div data-testid="spinner">{children || "mockSpinner"}</div>
    ),
  };
});


vi.mock("firebase/auth", async () => {
  const actual = await vi.importActual("firebase/auth");
  return {
    ...actual,
    updateProfile: vi.fn(),
  };
});

vi.mock("../../../../firebase", async () => {
  const actual = await vi.importActual<typeof import("../../../../firebase")>(
    "../../../../firebase"
  );
  return {
    ...actual,
    auth: {
      currentUser: {
        reload: vi.fn(),
      },
    },
  };
});

vi.mock("../addFriendButton/AddFriendButton", () => ({
  default: ({ userId }: { userId: string }) => (
    <button data-user-id={userId}> MockAddFriend</button>
  ),
}));
const mockMutateAsync = vi.fn();
const mockRefetch = vi.fn();

vi.mock("../../../../Utils/profileHttp", () => ({
  fetchPost: vi.fn(() => ({
    mutateAsync: mockMutateAsync,
    isPending: false,
  })),
  useLoadingPost: vi.fn(() => ({
    refetch: mockRefetch,
  })),
}));

describe("render addButtonPost when its owner and render addFriendButton when its another user profile", () => {
  const mockFetchPost: any = fetchPost;

  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("render addfriendbtn", async () => {
    CustomRender(<AddButtonPost userId="1" />);
    const friendbtn = screen.getByText("MockAddFriend");
    fireEvent.click(friendbtn);
    await waitFor(() => {
      expect(friendbtn).toHaveAttribute("data-user-id", "1");
    });
  });
  it("render addpostbtn", async () => {
    CustomRender(<AddButtonPost />);
    const postBtn = screen.getByText(/Add post/i);
    expect(postBtn).toBeInTheDocument();
    fireEvent.click(postBtn);

    const hiddenInput = screen.getByTestId("post-input");
    expect(hiddenInput).toHaveAttribute("type", "file");
    expect(hiddenInput).toHaveStyle({ display: "none" });
  });
  it("render btn isPending spin", () => {
    mockFetchPost.mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: true,
    });
    CustomRender(<AddButtonPost />);
    const spinner = screen.getByTestId(/spinner/i);
    expect(spinner).toBeInTheDocument();
    const postBtn = spinner.closest("button");
    expect(postBtn).toBeDisabled();
  });
  it("calls input.click() when Add post button is clicked", async () => {
    mockFetchPost.mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
    });
    CustomRender(<AddButtonPost />);

    const addPostBtn = screen.getByRole("button", { name: /Add post/i });
    const hiddenInput = screen.getByTestId("post-input") as HTMLInputElement;

    const clickSpy = vi.spyOn(hiddenInput, "click");
    fireEvent.click(addPostBtn);

    await waitFor(() => {
      expect(clickSpy).toHaveBeenCalledTimes(1);
    });

    clickSpy.mockRestore();
  });
  it("upload file and update profile", async () => {
    CustomRender(<AddButtonPost />);
    const hiddenInput = screen.getByTestId("post-input") as HTMLInputElement;
    const fakeFile = new File(["mock content"], "test.jpg", {
      type: "image/jpeg",
    });

    mockMutateAsync.mockResolvedValueOnce({
      downloadURL: "https://mock.url/test.jpg",
    });
    fireEvent.change(hiddenInput, { target: { files: [fakeFile] } });

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({ file: fakeFile });
      expect(updateProfile).toHaveBeenCalledWith(auth.currentUser, {
        photoURL: "https://mock.url/test.jpg",
      });
      expect(mockRefetch).toHaveBeenCalled();
      expect(auth.currentUser?.reload).toHaveBeenCalled();
    });
  });
});
