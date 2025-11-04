import { describe, it, expect, vi } from "vitest";
import { fireEvent, screen} from "@testing-library/react";
import CustomRender from "../../../../Utils/CustomRender";
import PostsAndLikes from "./PostsAndLikes";
import { useIsPostLiked } from "../../../../Utils/profileHttp";

vi.mock("../../../../Utils/profileHttp", async (importOriginal) => {
    const actual = await importOriginal<typeof import("../../../../Utils/profileHttp")>();
    return {
      ...actual,
      useIsPostLiked: vi.fn(() => ({ data: false })),
    };
  });
  vi.mock("antd", () => ({
    Image: ({ src, alt, onClick }: any) => <img data-testid = 'test-img' src={src} alt={alt} onClick={onClick} />,
  }));

let mockIsPostLiked:  ReturnType<typeof vi.fn>

describe('test PostAndLikesComponent', ()=>{
    beforeEach(()=>{
        vi.clearAllMocks();
        mockIsPostLiked = useIsPostLiked as ReturnType<typeof vi.fn>;
    });
    
  const onImageClick = vi.fn();
  const onToggleLike = vi.fn();

    const posts = [
        {
            id: '1',
            downloadURL: 'url1',
            storagePath: 'path1',
            ownerUid: 'owner1',
            likesCount: 1,
        },
        {
            id: '2',
            downloadURL: 'url2',
            storagePath: 'path2',
            ownerUid: 'owner2',
            likesCount: 2,
        }
    ];
    it('render all posts', ()=>{
        mockIsPostLiked.mockReturnValue({ data: false});
        CustomRender(<PostsAndLikes
        images={posts}
        likedPostIds={[]}
        onImageClick={onImageClick}
        onToggleLike={onToggleLike}
        className="className"
        />);
        const images = screen.getAllByTestId('test-img');
        expect(images).toHaveLength(posts.length);
        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
    });
    it('calls onImageClick when image is clicked', ()=>{
        mockIsPostLiked.mockReturnValue({ data: false});
        CustomRender(<PostsAndLikes
        images={posts}
        likedPostIds={[]}
        onImageClick={onImageClick}
        onToggleLike={onToggleLike}
        className="className"
        />);
        const images = screen.getAllByAltText(/post-/);
        fireEvent.click(images[0]);
        expect(onImageClick).toHaveBeenCalledWith(0);
    });
    it('calls onToggleLike when like button is clicked', ()=>{
        mockIsPostLiked.mockReturnValue({ data: true});
        CustomRender(<PostsAndLikes
        images={posts}
        likedPostIds={['1']}
        onImageClick={onImageClick}
        onToggleLike={onToggleLike}
        className="className"
        />);
        const likeButton = screen.getAllByRole('button');
        fireEvent.click(likeButton[0]);
        expect(onToggleLike).toHaveBeenCalledWith('1', true, 'owner1');
    })
})