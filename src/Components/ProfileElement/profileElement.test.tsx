import { describe, it, expect, vi } from "vitest";
import { screen} from "@testing-library/react";
import CustomRender from "../../Utils/CustomRender";
import ProfileElement from "./ProfileElement";
import { useSelector } from "react-redux";


vi.mock("react-redux", async () => {
    const actual = await vi.importActual<typeof import("react-redux")>(
        "react-redux"
    );
    return {
        ...actual,
        useSelector: vi.fn(),
    };
});
vi.mock('./Header/avatarProfile/AvatarProfile', ()=>({
    default: ()=> <div data-testid='avatar-profile'>Avatar Profile</div>
}));

vi.mock('./Header/postList/PostList', ()=> ({
    default: ()=> <div data-testid = 'post-list'>Post List</div>
}))

describe('test profile element', ()=> {
    beforeEach(()=>{
        (useSelector as any).mockReturnValue({
            firstName: 'john',
            lastName: 'doe',
        })
    })
    it("render avatarProfile element", ()=> {
        CustomRender(<ProfileElement userId="2"/>);
        const element = screen.getByTestId('avatar-profile');
        expect(element).toBeInTheDocument();
    });
    it('render PostList element', ()=> {
        CustomRender(<ProfileElement userId="2"/>);
        const element = screen.getByTestId('post-list');
        expect(element).toBeInTheDocument();
    });
    it('render line between AvatarProfile and PostList elements', () => {
        CustomRender(<ProfileElement userId="2"/>);
        const line = screen.getByTestId('profile-line');
        expect(line.className.includes('line')).toBe(true);
    });
    it('render dark bg', ()=> {
        const selector = useSelector as any;
        selector.mockReturnValue(true);
        CustomRender(<ProfileElement userId="2"/>);
        const container = screen.getByTestId("main-container");
        expect(container?.className).toContain('bgDark');
    });
})