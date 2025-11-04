import { describe, it, expect, vi } from "vitest";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import CustomRender from "../../../../Utils/CustomRender";
import {
  useLoadingPost,
  useUserLikedPostIds,
  useRemoveLike,
  useFetchLike,
  useRemovePost,
} from "../../../../Utils/profileHttp";

import PostList from "./PostList";
import { UseMutationResult } from "@tanstack/react-query";
type MockMutation = Partial<UseMutationResult<void, unknown>>;
type StrictMockMutation = {
  mutate: (...args: any[]) => void;
}

vi.mock("../../../../Utils/profileHttp", () => ({
  useFetchLike: vi.fn(),
  useLoadingPost: vi.fn(),
  useRemoveLike: vi.fn(),
  useRemovePost: vi.fn(),
  useUserLikedPostIds: vi.fn(()=>({data:[]})),
  useIsPostLiked: vi.fn(()=>({data:false})),
}));

vi.mock("antd", () => {
  const MockImage = ({ src, alt, onClick }: any) => (
    <img src={src} alt={alt} onClick={onClick} />
  );

  MockImage.PreviewGroup = ({ children }: any) => <div>{children}</div>;

  return { Image: MockImage };
});
vi.mock("../../UI/ButtonImage", () => ({
  __esModule: true,
  default: ({ children, ...props }: any) => (
    <button {...props}>
      {children}
    </button>
  ),
}));

vi.mock("../postsAndLikes/PostsAndLikes", () => ({
  default: ({
    images,
    onToggleLike,
    likedPostIds,
    onImageClick,
  }: {
    images: any[];
    onToggleLike: (postId: string, isLiked: boolean, ownerUid: string) => void;
    likedPostIds: string[];
    onImageClick: (index: number) => void;
  }) => {
    const isLiked = likedPostIds.includes("1");
    return (
      <div>
        <div
          data-testid="posts-and-likes"
          onClick={() => onToggleLike("1", isLiked, "owner123")}
        >
          Mocked PostsAndLikes ({images.length})
        </div>
        <button data-testid="open-image" onClick={() => onImageClick(0)}>
          Open Image
        </button>
      </div>
    );
  },
}));

let mockLoadingPost: ReturnType<typeof vi.fn>;
let mockUserLikedPostIds: ReturnType<typeof vi.fn>;
let mockFetchLike: ReturnType<typeof vi.fn>;
let mockDeletePost: ReturnType<typeof vi.fn>;
let mockRemoveLike: ReturnType<typeof vi.fn>;

describe("test postList component", () => {
  const mockLike: StrictMockMutation = { mutate: vi.fn() };
  const mockUnlike: StrictMockMutation = { mutate: vi.fn() };
  const mockRemovePost: MockMutation = { mutateAsync: vi.fn() };

  beforeEach(() => {
    vi.clearAllMocks();
    mockLoadingPost = useLoadingPost as ReturnType<typeof vi.fn>;
    mockUserLikedPostIds = useUserLikedPostIds as ReturnType<typeof vi.fn>;
    mockFetchLike = useFetchLike as ReturnType<typeof vi.fn>;
    mockDeletePost = useRemovePost as ReturnType<typeof vi.fn>;
    mockRemoveLike = useRemoveLike as ReturnType<typeof vi.fn>;
  });
  describe("test postList when does not matter whoes page it is", () => {
    it("render isPending", () => {
      mockLoadingPost.mockReturnValue({
        data: [],
        isPending: true,
      });
      CustomRender(<PostList />);
      const pend = screen.getByText("...Pending");
      expect(pend).toBeInTheDocument();
    });
    it("render when isError", () => {
      mockLoadingPost.mockReturnValue({
        data: [],
        isError: true,
      });
      CustomRender(<PostList />);
      const err = screen.getByText("Error loading posts");
      expect(err).toBeInTheDocument();
    });
    it("render likes button", () => {
      mockLoadingPost.mockReturnValue({
        data: [{ id: "1", ownerUid: "owner123", storagePath: "path1" }],
        isPending: false,
      });
      CustomRender(<PostList />);
      const likesBtn = screen.getByTestId("posts-and-likes");
      expect(likesBtn).toBeInTheDocument();
    });
  });
  describe("test postList when current user", () => {
    it("render empty post list for current user", () => {
      mockLoadingPost.mockReturnValue({
        data: [],
      });
      CustomRender(<PostList />);
      const shallow = screen.getByText("Your posts list is empty");
      expect(shallow).toBeInTheDocument();
    });
    it("test toggle like for current user", async () => {
      mockUserLikedPostIds.mockReturnValue({
        data: [],
        isLoading: false,
        isError: false,
      });
      mockLoadingPost.mockReturnValue({
        data: [
          {
            userId: "1",
            ownerUid: "owner123",
          },
        ],
      });
      mockFetchLike.mockReturnValue({ mutate: mockLike.mutate });
      mockRemoveLike.mockReturnValue({mutate: mockUnlike.mutate});
      const post = { id: "1", ownerUid: "owner123" };
      
      
      const handlePutLike = (postId: string, isLiked: boolean, ownerUid: string) => {
        if (isLiked) mockUnlike?.mutate({ postId, ownerUid });
        else mockLike?.mutate({ postId, ownerUid });
      };

      CustomRender(<PostList />);
   
    handlePutLike(post.id, false, post.ownerUid);
    expect(mockLike.mutate).toHaveBeenCalledWith({
      postId: "1",
      ownerUid: "owner123",
    });

  
    handlePutLike(post.id, true, post.ownerUid);
    expect(mockUnlike.mutate).toHaveBeenCalledWith({
      postId: "1",
      ownerUid: "owner123",
    });


    expect(mockLike.mutate).toHaveBeenCalledTimes(1);
    expect(mockUnlike.mutate).toHaveBeenCalledTimes(1);
  });
});
    
    it("test remove post btn for current user", async () => {
      mockLoadingPost.mockReturnValue({
        data: [
          {
            id: "1",
            ownerUid: "owner123",
            storagePath: "path1",
          },
        ],
      });
      mockDeletePost.mockReturnValue(mockRemovePost);
      CustomRender(<PostList />);
      const postLike = screen.getByTestId("open-image");
      fireEvent.click(postLike);
      const removeBtn = await screen.findByTestId("deleteBtn");
      fireEvent.click(removeBtn);
      await waitFor(() => {
        expect(mockRemovePost.mutateAsync).toHaveBeenCalledWith({
          id: "1",
          storagePath: "path1",
        });
      });
    });
    describe("test postList, when guest", () => {
      it("render vacuous post list when another user", () => {
        mockLoadingPost.mockReturnValue({ data: [] });
        CustomRender(<PostList userId="123" />);
        const vain = screen.getByTestId("vain-post");
        expect(vain).toHaveTextContent("This user has no posts");
      });
      it("test toggle like for another user", async () => {
        mockUserLikedPostIds.mockReturnValue({
          data: [],
        });
        mockLoadingPost.mockReturnValue({
          data: [
            {
              userId: "1",
              ownerUid: "owner123",
            },
          ],
        });
        mockFetchLike.mockReturnValue({ mutate: mockLike.mutate });

        CustomRender(<PostList userId="1" />);
        const postLike = screen.getByTestId("posts-and-likes");
        fireEvent.click(postLike);
        await waitFor(() => {
          expect(mockLike.mutate).toHaveBeenCalledWith({
            postId: "1",
            ownerUid: "owner123",
          });
        });
      });
    });
  });

