import { describe, it, expect, vi } from "vitest";
import { screen} from "@testing-library/react";
import CustomRender from "../../../../Utils/CustomRender";
import AvatarProfile from "./AvatarProfile";
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
vi.mock("../../../../Utils/http", async () => {
  const actual = await vi.importActual<typeof import("../../../../Utils/http")>(
    "../../../../Utils/http"
  );
  return {
    ...actual,

    useLoadingAvatar: vi.fn(() => ({
      data: "https://mock-avatar.com/avatar.png",
    })),
  };
});

vi.mock("../../../../Utils/profileHttp", async () => {
  const actual = await vi.importActual<
    typeof import("../../../../Utils/profileHttp")
  >("../../../../Utils/profileHttp");
  return {
    ...actual,
    useGetOtherName: vi.fn(() => ({
      data: { firstName: "john", lastName: "doe" },
    })),
  };
});
vi.mock("../addButtonPost/AddButtonPost", () => ({
  default: () => <button>add friend</button>,
}));
vi.mock("../PostsCounter", () => ({
  default: () => <span>Posts: 3</span>,
}));
describe("test Avatar profile component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    const selector = useSelector as any;
    selector.mockReturnValue(false);
  });
  it("test bgDark theme", () => {
    const selector = useSelector as any;
    selector.mockReturnValue(true);
    CustomRender(<AvatarProfile userId={"1"} />);
    const container = screen.getByTestId("avatar-cotainer");
    expect(container?.className).toContain("avatarDark");
  });
  it("render avatar-profile", () => {
    CustomRender(<AvatarProfile />);
    const avatar = screen.getByAltText("profile-avatar");
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute("src", "https://mock-avatar.com/avatar.png");
  });
  it("download avatar-profile", async () => {
    CustomRender(<AvatarProfile />);
    const image = screen.getByAltText("profile-avatar");

    expect(image).toBeInTheDocument();
  });
  it("renders user name and posts counter", () => {
    CustomRender(<AvatarProfile userId="123" />);
    const name = screen.getByTestId("names");
    expect(name).toHaveTextContent("john");
    expect(name).toHaveTextContent("doe");
  });
});
