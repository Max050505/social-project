import { describe, it, expect, vi } from "vitest";
import { fireEvent, screen, waitFor} from "@testing-library/react";
import CustomRender from "../../../Utils/CustomRender";
import SearchName from "./SearchName";
import { useSearchName } from "../../../Utils/SearchHttp";


vi.mock("../../../Utils/SearchHttp", async () => {
  const actual = await vi.importActual<
    typeof import("../../../Utils/SearchHttp")
  >("../../../Utils/SearchHttp");
  return {
    ...actual,
    useSearchName: vi.fn(),
  };
});

describe("Testing SearchName in friendPage", () => {
  const searchName = useSearchName as ReturnType<typeof vi.fn>;
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls value when found users", async () => {
    searchName.mockReturnValue({
      data: [
        { id: "1", firstName: "john", lastName: "Doe" },
        { id: "2", firstName: "Chak", lastName: "Van" },
      ],
      isLoading: false,
    });
    CustomRender(<SearchName />);
    const input = screen.getByPlaceholderText(/Search by name.../i);
    fireEvent.change(input, { target: { value: "john" } });

    await waitFor(() => {
        expect(screen.getByText(/chak van/i)).toBeInTheDocument();
        expect(screen.getByText(/john doe/i)).toBeInTheDocument();
    }, { timeout: 2000 });
  });
  it("clear search when allowClear is clecked", async () => {
    (searchName as any).mockImplementation((query: any) => {
        if (!query) {
          return { data: [], isLoading: false };
        }
        return {
          data: [{ id: "1", firstName: "john", lastName: "Doe" }],
          isLoading: false,
        };
      });
    CustomRender(<SearchName />);
    const input = screen.getByPlaceholderText(/Search by name.../i);

    fireEvent.change(input, { target: { value: "someone" } });
    
    await waitFor(() => {
        expect(screen.getByText(/john doe/i)).toBeInTheDocument();
    }, { timeout: 2000 });
    
    fireEvent.change(input, { target: { value: "" } });

    await waitFor(() => {
        expect(screen.queryByText(/john doe/i)).not.toBeInTheDocument();
    }, { timeout: 2000 });
  });
});
