import { describe, it, expect, vi } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import CustomRender from "../../Utils/CustomRender";
import MainElement from "./MainElement";
import { useSelector } from "react-redux";
import { useGetFriendsPosts } from "../../Utils/httpMain";
import {
  useUserLikedPostIds,
  useFetchLike,
  useRemoveLike,
} from "../../Utils/profileHttp";

vi.mock("react-redux", async () => {
  const actual = await vi.importActual<typeof import("react-redux")>(
    "react-redux"
  );
  return {
    ...actual,
    useSelector: vi.fn(),
  };
});

vi.mock("../../Utils/httpMain", () => ({
  useGetFriendsPosts: vi.fn(() => ({
    data: [
      {
        id: "1",
        downloadURL: "https://example.com/image.jpg",
        storagePath: "images/posts/1.jpg",
        ownerUid: "user1",
        likesCount: 1,
        avatar: "https://example.com/avatar.jpg",
        authorFullName: "John Doe",
      },
    ],
    isLoading: false,
  })),
}));

vi.mock("../../Utils/profileHttp", () => ({
  useUserLikedPostIds: vi.fn(() => ({
    data: [],
  })),
  useFetchLike: vi.fn(() => ({
    mutate: vi.fn(),
  })),
  useRemoveLike: vi.fn(() => ({
    mutate: vi.fn(),
  })),
  useIsPostLiked: vi.fn(() => ({
    data: false,
  })),
}));

vi.mock("react-router-dom", () => ({
  NavLink: ({ to, children }: any) => (
    <div data-testid="navlink" data-to={to}>
      {children}
    </div>
  ),
  MemoryRouter: ({ children }: any) => (
    <div data-testid="memory-router">{children}</div>
  ),
}));

vi.mock("antd", () => ({
  Image: ({ src }: { src: string }) => (
    <img src={src} alt="mock" data-testid="image" />
  ),
}));

vi.mock("../ProfileElement/Header/PostsAndLikes", () => ({
  default: ({
    images,
    onToggleLike,
    likedPostIds,
  }: {
    images: any[];
    onToggleLike: (postId: string, isLiked: boolean, ownerUid: string) => void;
    likedPostIds: string[];
  }) => {
    const isLiked = likedPostIds.includes("1");
    return (
      <div
        data-testid="posts-and-likes"
        onClick={() => onToggleLike("1", isLiked, "owner123")}
      >
        Mocked PostsAndLikes ({images.length})
      </div>
    );
  },
}));

describe("testing mainPage list of all posts", () => {
  const mockGetFriendsPosts = useGetFriendsPosts as ReturnType<typeof vi.fn>;
  const mockLikedPosts = useUserLikedPostIds as ReturnType<typeof vi.fn>;
    const mockLike = useFetchLike as ReturnType<typeof vi.fn>;
    const mockUnlike = useRemoveLike as ReturnType<typeof vi.fn>;
  beforeEach(() => {
    const selector = useSelector as any;
    selector.mockReturnValue(false);
    vi.clearAllMocks();
  });
  it("render dark bg", () => {
    const selector = useSelector as any;
    selector.mockReturnValue(true);
    CustomRender(<MainElement />);
    const container = screen.getByTestId("main-container");
    expect(container?.className).toContain("bgDark");
  });
  it("render when post list is empty", () => {
    mockGetFriendsPosts.mockReturnValue({
      data: [],
      isLoading: false,
    });
    CustomRender(<MainElement />);

    expect(screen.getByText(/Your posts list is empty/i)).toBeInTheDocument();
  });
  it("render when post list is loading", () => {
    mockGetFriendsPosts.mockReturnValue({
      data: [
        {
          id: "1",
          downloadURL: "https://example.com/image.jpg",
          storagePath: "images/posts/1.jpg",
          ownerUid: "user1",
          likesCount: 1,
          avatar: "https://example.com/avatar.jpg",
          authorFullName: "John Doe",
        },
      ],
      isLoading: true,
    });
    CustomRender(<MainElement />);
    expect(
      screen.getByText(/Wait a second the posts are loading.../i)
    ).toBeInTheDocument();
  });
  it("render post list with post", () => {
    mockLikedPosts.mockReturnValue({ data: ["1"] });
    mockGetFriendsPosts.mockReturnValue({
      data: [
        {
          id: "1",
          downloadURL: "https://example.com/image.jpg",
          storagePath: "images/posts/1.jpg",
          ownerUid: "user1",
          likesCount: 1,
          avatar: "https://example.com/avatar.jpg",
          authorFullName: "John Doe",
        },
      ],
      isLoading: false,
    });
    CustomRender(<MainElement />);
    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    expect(screen.getByTestId('posts-and-likes')).toBeInTheDocument();
  });
  it('calls like when the post has not liked yet', () => {
    const mutateLike = vi.fn();
    const mutateUnlike = vi.fn();
    mockLike.mockReturnValue({mutate: mutateLike});
    mockUnlike.mockReturnValue({mutate: mutateUnlike});
    mockLikedPosts.mockReturnValue({ data: [] }); // Not liked yet
    mockGetFriendsPosts.mockReturnValue({
        data: [
          {
            id: "1",
            downloadURL: "https://example.com/image.jpg",
            storagePath: "images/posts/1.jpg",
            ownerUid: "user1",
            likesCount: 1,
            avatar: "https://example.com/avatar.jpg",
            authorFullName: "John Doe",
          },
        ],
        isLoading: false,
      });
      CustomRender(<MainElement />);
      fireEvent.click(screen.getByTestId('posts-and-likes'));
      expect(mutateLike).toHaveBeenCalledWith({postId: '1', ownerUid: 'owner123'});
      expect(mutateUnlike).not.toHaveBeenCalled();
  })
  it('calls unlike when the post has been liked', () => {
    const mutateLike = vi.fn();
    const mutateUnlike = vi.fn();
    mockLike.mockReturnValue({mutate: mutateLike});
    mockUnlike.mockReturnValue({mutate: mutateUnlike});
    mockLikedPosts.mockReturnValue({ data: ["1"] }); 
    mockGetFriendsPosts.mockReturnValue({
        data: [
          {
            id: "1",
            downloadURL: "https://example.com/image.jpg",
            storagePath: "images/posts/1.jpg",
            ownerUid: "user1",
            likesCount: 1,
            avatar: "https://example.com/avatar.jpg",
            authorFullName: "John Doe",
          },
        ],
        isLoading: false,
      });
      CustomRender(<MainElement />);
      fireEvent.click(screen.getByTestId("posts-and-likes"));

      expect(mutateUnlike).toHaveBeenCalledWith({ postId: "1", ownerUid: "owner123" });
      expect(mutateLike).not.toHaveBeenCalled();
  });
  it('navLink test with correct link', ()=> {
    mockGetFriendsPosts.mockReturnValue({
        data: [
          {
            id: "1",
            downloadURL: "https://example.com/image.jpg",
            storagePath: "images/posts/1.jpg",
            ownerUid: "user1",
            likesCount: 1,
            avatar: "https://example.com/avatar.jpg",
            authorFullName: "John Doe",
          },
        ],
        isLoading: false,
      });
      CustomRender(<MainElement />);
      const navLink = screen.getByTestId('navlink');
      expect(navLink.getAttribute('data-to')).toBe('1');
      expect(screen.getByAltText('mock')).toHaveAttribute('src', 'https://example.com/avatar.jpg');
  })
});
