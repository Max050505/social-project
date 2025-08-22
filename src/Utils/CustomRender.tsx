import { QueryClientProvider } from "@tanstack/react-query"
import { render } from "@testing-library/react"
import { queryClient } from "./http";
import {MemoryRouter } from "react-router-dom";

const CustomRender = (children: React.ReactNode, initialEntries = ['/']) => {
    return render(<QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
    </QueryClientProvider>)
}

export default CustomRender;