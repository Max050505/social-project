import { QueryClientProvider } from "@tanstack/react-query"
import { render } from "@testing-library/react"
import { queryClient } from "./http";
import {MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "../store";

const CustomRender = (children: React.ReactNode, initialEntries = ['/']) => {
    return render(
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
            </QueryClientProvider>
        </Provider>
    )
}

export default CustomRender;