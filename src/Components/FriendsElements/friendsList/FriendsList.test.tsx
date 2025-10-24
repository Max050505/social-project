import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import CustomRender from "../../../Utils/CustomRender";
import FriendsList from "./FriendsList";
import { useGetFriendsUser } from "../../../Utils/httpFriendRequest";
import { useRemoveFromFriends } from "../../../Utils/httpFriendRequest";
import userEvent from "@testing-library/user-event";

interface Friend {
  id: string;
  name: string;
  email: string;
  avatar: string;
}
vi.mock("../../../Utils/httpFriendRequest", async () => {
  const actual = await vi.importActual<
    typeof import("../../../Utils/httpFriendRequest")
  >("../../../Utils/httpFriendRequest");
  return {
    ...actual,
    useGetFriendsUser: vi.fn(() => ({
      data: [],
      isLoading: false,
    })),
    useRemoveFromFriends: vi.fn(() => ({
      mutate: vi.fn(),
      isPending: false,
    })),
  };
});

describe("Testing FriendsList element", () => {
  it("renders empty state when no friends", () => {
    (useGetFriendsUser as ReturnType<typeof vi.fn>).mockReturnValue({
      data: [],
      isLoading: false,
    });
    CustomRender(<FriendsList userId={"1"} />);
    const noFriends = screen.getByText("No friends.");
    expect(noFriends).toBeInTheDocument();
  });
  it("renders loading state when loading", () => {
    (useGetFriendsUser as ReturnType<typeof vi.fn>).mockReturnValue({
      data: [],
      isLoading: true,
    });
    CustomRender(<FriendsList userId={"1"} />);
    const loading = screen.getByText("Loading sent requests...");
    expect(loading).toBeInTheDocument();
  });
  it("renders friends list when friends are available", async () => {
    const mockMutate = vi.fn();
    const mockFriends: Friend[] = [
      {
        id: "1",
        name: "john doe",
        email: "john.doe@example.com",
        avatar: "https://example.com/avatar.png",
      },
    ];
    const useGetFriendsUserMock = useGetFriendsUser as unknown as ReturnType<
      typeof vi.fn
    >;
    const useRemoveFromFriendsMock =
      useRemoveFromFriends as unknown as ReturnType<typeof vi.fn>;
    useGetFriendsUserMock.mockReturnValue({
      data: mockFriends,
      isLoading: false,
    });
    useRemoveFromFriendsMock.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });
    CustomRender(<FriendsList userId={"1"} />);
    const friend = screen.getByText("john doe");
    expect(friend).toBeInTheDocument();
    const removeButton = screen.getByRole("button", { name: "Remove" });
    await userEvent.click(removeButton);
    expect(mockMutate).toHaveBeenCalledWith("1");
  });
});
