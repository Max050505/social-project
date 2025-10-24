import { describe, it, expect, vi } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import CustomRender from "../../Utils/CustomRender";
import MainFriendsElement from "./MainFriendsElement";
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

vi.mock("./searchName/SearchName", () => ({
  default:() => <div data-testid="search-name">SearchComponent</div>,
}));
vi.mock("./fromList/FromList", () => ({
  default: () =>  <div data-testid="from-list">FromList</div>,
}));
vi.mock("./toList/ToList", () => ({
  default: () =>  <div data-testid="to-list">ToList</div>,
}));
vi.mock("./friendsList/FriendsList", () => ({
  default:  ({ userId }: { userId: string }) => (
    <div data-testid="friends-list">FriendsList for {userId}</div>
  ),
}));
vi.mock("../../UI/Tabs", () => ({
  default: ({ children, buttons }: any) => (
    <div>
      <div data-testid="tab-buttons">{buttons}</div>
      <div data-testid="tab-content">{children}</div>
    </div>
  ),
}));
vi.mock("../../UI/TapButton", () => ({
  default: ({ children, onClick, className }: any) => (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  ),
}));
describe("Testing fathers element of friendPage", () => {
  beforeEach(() => {
    const selector = useSelector as any;
    selector.mockReturnValue(false);
  });
  it("render searchName and friend list by default", () => {
    CustomRender(<MainFriendsElement userId={'1'}/>);
    expect(screen.getByTestId('search-name')).toBeInTheDocument();
    expect(screen.getByTestId('friends-list')).toHaveTextContent('1');
  });
  it('render switch to sended request ', ()=> {
    CustomRender(<MainFriendsElement userId={'1'}/>);
    fireEvent.click(screen.getByText(/Sended requests/i));
    expect(screen.getByTestId('to-list')).toBeInTheDocument();
  });
  it('render switch to obtains request', () => {
    CustomRender(<MainFriendsElement userId={'1'}/>);
    fireEvent.click(screen.getByText(/Obtains Requests/i));
    expect(screen.getByTestId('from-list')).toBeInTheDocument();
  })
   it('render dark bg', () => {
     const selector = useSelector as any;
     selector.mockReturnValue(true);
     CustomRender(<MainFriendsElement userId={'1'}/>);
     const container = screen.getByTestId("main-container");
     expect(container?.className).toContain('bgDark');
   })
});
