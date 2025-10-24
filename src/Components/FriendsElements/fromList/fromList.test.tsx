import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import CustomRender from "../../../Utils/CustomRender";
import FromList from "./FromList";
import { useGetFromRequestUser, useRemoveRequestToFriends, useSendToFriends } from "../../../Utils/httpFriendRequest";
import userEvent from "@testing-library/user-event";

interface FromListProps {
    id: string;
    name: string;
    email: string;
    avatar: string;
}

vi.mock("../../../Utils/httpFriendRequest", async () => {
    const actual = await vi.importActual<typeof import("../../../Utils/httpFriendRequest")>(
        "../../../Utils/httpFriendRequest"
    );
    return {
        ...actual,
        useGetFromRequestUser: vi.fn(() => ({
            data: [],
            isLoading: false,
        })),
        useRemoveRequestToFriends: vi.fn(() => ({
            mutate: vi.fn(),
            isPending: false,
        })),
        useSendToFriends: vi.fn(() => ({
            mutate: vi.fn(),
            isPending: false,
        })),
    };
});

describe("Testing FromList element", () => {
    it("renders empty state when no requests", () => {
        (useGetFromRequestUser as ReturnType<typeof vi.fn>).mockReturnValue({
            data: [],
            isLoading: false,
        });
        CustomRender(<FromList userId={"1"} />);
        const emptyState = screen.getByText(/No requests./i);
        expect(emptyState).toBeInTheDocument();
    });
    it('render loading state when loading', () => {
        (useGetFromRequestUser as ReturnType<typeof vi.fn>).mockReturnValue({
            data:[],
            isLoading: true,
        });
        CustomRender(<FromList userId={'1'}/>);
        const loadingState = screen.getByText(/Loading requests.../i);
        expect(loadingState).toBeInTheDocument();
    });
    it('render list when friends are available', async ()=>{
        const mockMutate = vi.fn();
        const mockRequestFriend: FromListProps[]=[
            {
                id: '1',
                name: 'john doe',
                email: 'john.doe@example.com',
                avatar: 'https://example.com/avatar.png',
            },
        ];
        (useGetFromRequestUser as ReturnType<typeof vi.fn>).mockReturnValue({

            data: mockRequestFriend,
            isLoading: false,
        });
        (useRemoveRequestToFriends as ReturnType<typeof vi.fn>).mockReturnValue({
            mutate: mockMutate,
            isPending: false
        });
        (useSendToFriends as ReturnType<typeof vi.fn>).mockReturnValue({
            mutate: mockMutate,
            isPending: false
        });
        CustomRender(<FromList userId={"1"} />);
        const anotherUser = screen.getByText('john doe');
        expect(anotherUser).toBeInTheDocument();
        const cancelButton = screen.getByRole('button', {name: 'Cancel'});
        const acceptButton = screen.getByRole('button', {name: 'Accept'})
        await userEvent.click(cancelButton);
        await userEvent.click(acceptButton);
        expect(mockMutate).toHaveBeenCalledWith('1')
        expect(mockMutate).toHaveBeenCalledWith('1');

    })
});