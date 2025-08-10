import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { useEffect, type JSX } from "react";
import { queryClient } from "./Utils/http";
import { callIdTokenChange } from "./Utils/authService";
import HomePage from "./Pages/HomePage";
import RegistrationPage from "./Pages/RegistrationPage";
import AuthenticationPage from "./Pages/AuthenticationPage";
import WelcomePage from "./Pages/WelcomePage";
import "./App.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    id: "root",
    children: [
      { path: "registration", element: <RegistrationPage /> },
      { index: true, element: <AuthenticationPage /> },
    ],
  },
  {
    path: '/welcome',
    element:<WelcomePage/>,
    id:'welcome',
  }
]);
function App(): JSX.Element {
  useEffect(() => {
    callIdTokenChange();
  } , [])
  return (
    <QueryClientProvider client={queryClient}>

      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
