import { describe, it, expect, vi } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import CustomRender from "../../Utils/CustomRender";
import SideBar from "./SideBar";

const mockMutateAsync = vi.fn().mockResolvedValue(undefined);
vi.mock("react-redux", async () => {
  const actual = await vi.importActual<typeof import("react-redux")>(
    "react-redux"
  );
  return {
    ...actual,
    useSelector: vi.fn((fn) =>
      fn({
        theme: false,
        startPageState: { isActive: false },
        name: { firstName: "john", lastName: "doe" },
        email: "example@email.com",
      })
    ),
    useDispatch: () => vi.fn(),
  };
});

vi.mock("../../Utils/http", async () => {
  const actual = await vi.importActual<typeof import("../../Utils/http")>(
    "../../Utils/http"
  );
  return {
    ...actual,
    logOut: () => ({
      mutateAsync:  mockMutateAsync,
      mutate: vi.fn(),
    }),
    queryClient: {
      fetchQuery: vi.fn(),
      mount: vi.fn(),
      unmount: vi.fn(),
      getQueryData: vi.fn(),
      setQueryData: vi.fn(),
      invalidateQueries: vi.fn(),
    },
    useLoadingAvatar: () => ({ data: "avatar.png" }),
    fetchAvatarByUid: vi.fn(),
  };
});
vi.mock("../../Utils/useAuthChanged", () => ({
  useAuthReady: () => true,
}));
vi.mock("./SideBarHiddenButton", () => ({
  default: () => <div data-testid="hidden-button">Hidden Btn</div>,
}));
vi.mock("../../UI/logo", () => ({
  logos: Array.from({ length: 15 }, (_, i) => ({
    image: `img${i}.png`,
    alt: `alt${i}`,
  })),
}));
vi.mock("../../UI/Modal", () => ({
  default: ({ children }: any) => <div>{children}</div>,
}));

describe("testing sideBar component", () => {
  
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("test links to pages", () => {
    CustomRender(<SideBar />);

    const friendsLink = screen.getByRole("link", { name: /Friends/i });
    const profileLink = screen.getByRole("link", { name: /My profile/i });
    const mainink = screen.getByRole("link", { name: /Main/i });
    const coonfiglink = screen.getByRole("link", { name: /Config/i });

    expect(friendsLink).toHaveAttribute("href", "/friends");
    expect(profileLink).toHaveAttribute("href", "/profile");
    expect(mainink).toHaveAttribute("href", "/story");
    expect(coonfiglink).toHaveAttribute("href", "/config");
  });
  it('render logo images', ()=> {
    CustomRender(<SideBar/>);
    const logo = screen.getAllByRole('img');
    expect(logo.length).toBeGreaterThan(0);
  });
  it('render hiddenButton', ()=>{
    CustomRender(<SideBar/>);
    const btn = screen.getByTestId('hidden-button');
    expect(btn).toBeInTheDocument();    
  });
  it('calls logOut whe when logout button dclicked',async ()=> {
    Object.defineProperty(window, "innerWidth", { writable: true, configurable: true, value: 1200 });
window.dispatchEvent(new Event("resize"));

    CustomRender(<SideBar/>);

    const logoutBtn = screen.getAllByText(/logout/i)[0];
    fireEvent.click(logoutBtn);
    await screen.findByText(/Confirm Logout/i);
    const logoutButton = await screen.findByTestId("logout-button");
    fireEvent.click(logoutButton);
    expect(mockMutateAsync).toHaveBeenCalled();
  }, 10000);
});
