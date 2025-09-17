import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { useEffect, type JSX } from "react";
import { queryClient } from "./Utils/http";
import { callIdTokenChange } from "./Utils/authService";
import { loader as avatarLoad} from './Components/SideBar/SideBar';
import HomePage from "./Pages/HomePage";
import RegistrationPage from "./Pages/RegistrationPage";
import AuthenticationPage from "./Pages/AuthenticationPage";
import WelcomePage from "./Pages/WelcomePage";
import "./App.css";
import SocialPage from "./Pages/SocialPage";
import ConfigPage from "./Pages/ConfigPage";
import ProtectedRoutes from "./Components/protectedRoutes/ProtectedRoutes";
import ProfilePage from "./Pages/ProfilePage";

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
    path:'/welcome',
    element:<ProtectedRoutes><SocialPage/></ProtectedRoutes>,
    id:'social',
    loader: avatarLoad,
    children:[
      {
        index: true,
        element:<WelcomePage/>,
        id:'welcome',
      },
      {
        path:'config',
        element:<ConfigPage/>,
        id:'config',
      },
      {
        path: "profile",
        element: <ProfilePage/>,
        id:'profile',
      }
    ]
  },
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
