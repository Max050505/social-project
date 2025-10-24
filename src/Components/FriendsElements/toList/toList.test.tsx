import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import CustomRender from "../../../Utils/CustomRender";
import ToList from "./ToList";
import { useGetSentFriendRequests, useRemoveRequestToFriends} from "../../../Utils/httpFriendRequest";
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
    useGetSentFriendRequests: vi.fn(()=>({
        data: [],
        isLoading: false,
    })),
    useRemoveRequestToFriends: vi.fn( ()=>({
        mutate: vi.fn(),
        isPending: false,
    }))
}
})

describe('Testing ToLost element', () => {
    it('render empty state when No sent requests.', () => {
        (useGetSentFriendRequests as ReturnType<typeof vi.fn>).mockReturnValue({
            data:[],
            isLoading: false
        });
        CustomRender(<ToList userId={"1"}/>);
        const emptyState = screen.getByText(/No sent requests./i)
        expect(emptyState).toBeInTheDocument();
    });
    it('render loading state when loading', ()=> {
        (useGetSentFriendRequests as ReturnType<typeof vi.fn>).mockReturnValue({
            data:[],
            isLoading: true
        });
        CustomRender(<ToList userId={"1"}/>);
        const loadingState = screen.getByText(/Loading sent requests.../i);
        expect(loadingState).toBeInTheDocument();
    });
    it('render list when request is available', async ()=> {
        const mockMutate = vi.fn();
        const toList: FromListProps[] = [{
            id: "1",
            name: "john doe",
            email: "john.doe@example.com",
            avatar: "https://example.com/avatar.png",
        }]
        const getFromRequestUser = (useGetSentFriendRequests as ReturnType<typeof vi.fn>);
        const removeRequestToFriends = (useRemoveRequestToFriends as ReturnType<typeof vi.fn>);

        getFromRequestUser.mockReturnValue({ data: toList, isLoading: false});
        removeRequestToFriends.mockReturnValue({
            mutate: mockMutate, isPending: false,
        })

        CustomRender(<ToList userId={"1"}/>);

        const requestedUser = screen.getByText('john doe');
        expect(requestedUser).toBeInTheDocument();
        const cancelButton = screen.getByRole('button', {name: /cancel/i});
        await userEvent.click(cancelButton);
        expect(mockMutate).toHaveBeenCalledWith('1');
    })
})