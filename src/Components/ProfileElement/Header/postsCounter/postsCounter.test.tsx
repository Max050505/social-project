import { describe, it, expect, vi } from "vitest";
import { screen} from "@testing-library/react";
import CustomRender from "../../../../Utils/CustomRender";
import PostsCounter from "./PostsCounter";
import { useLoadingPost } from "../../../../Utils/profileHttp";

vi.mock('../../../../Utils/profileHttp', ()=>({
    useLoadingPost: vi.fn(),
}))

let mockLoadingPost: ReturnType<typeof vi.fn>;
describe('test post counter', ()=>{
    beforeEach(() => {
        vi.clearAllMocks();
        mockLoadingPost = useLoadingPost as ReturnType<typeof vi.fn>;
      });
    it('render loading... when isLoading', ()=>{
        mockLoadingPost.mockReturnValue({isLoading: true});
        CustomRender(<PostsCounter/>);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
    it('render err when isError',()=>{
        mockLoadingPost.mockReturnValue({isError: true});
        CustomRender(<PostsCounter/>);
        expect(screen.getByText('Error')).toBeInTheDocument();
    });
    it("render 'Posts: 0' when no posts", ()=> {
        mockLoadingPost.mockReturnValue({data: []});
        CustomRender(<PostsCounter/>);
        const counter = screen.getByTestId('counter');
        expect(counter).toHaveTextContent('Posts:0');
    });
    it("render 'Posts: 1' when only one post", ()=> {
        mockLoadingPost.mockReturnValue({data: [{}]});
        CustomRender(<PostsCounter/>);
        const counter = screen.getByTestId('counter');
        expect(counter).toHaveTextContent('Post:1');
    });
    it("render 'Posts: 2' when only two posts", ()=> {
        mockLoadingPost.mockReturnValue({data: [{}, {}]});
        CustomRender(<PostsCounter/>);
        const counter = screen.getByTestId('counter');
        expect(counter).toHaveTextContent('Posts:2');
    });
    it("calls useLoadingPost with userId", () => {
        mockLoadingPost.mockReturnValue({ data: [] });
        CustomRender(<PostsCounter userId="123" />);
        expect(mockLoadingPost).toHaveBeenCalledWith({ userId: "123" });
      });
})