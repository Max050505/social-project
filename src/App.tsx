import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { useEffect, type JSX } from "react";
import { queryClient } from "./Utils/http";
import { callIdTokenChange, useAuthUser } from "./Utils/authService";
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
import FriendsPage from "./Pages/FriendsPage";
import MainPage from "./Pages/MainPage";
import Notification from "./Components/SideBar/Notification";
import {App as AntdApp} from 'antd';
const router = createBrowserRouter([
  {
    path: "/main",
    element: <HomePage />,
    id: "root",
    children: [
      { path: "registration", element: <RegistrationPage /> },
      { index: true, element: <AuthenticationPage /> },
    ],
  },

  {
    path:'/',
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
      },
      {
        path: "profile/:id",
        element: <ProfilePage/>,
        id:'user-profile',
      },
      {
        path:'friends',
        element:<FriendsPage/>,
        id:'friends',
      },
      {
        path:'story',
        element:<MainPage/>,
        id:'main',
      }
    ]
  },
]);
function App(): JSX.Element {
  const {user, loading} = useAuthUser()
  
  useEffect(() => {
    callIdTokenChange();
  } , []);

  useEffect(() => {
    if (user && !loading) {
      queryClient.invalidateQueries(); 
    }
  }, [user, loading]);
  return (
    <QueryClientProvider client={queryClient}>
      <AntdApp>
      <Notification>
      <RouterProvider router={router} />
      </Notification>
      </AntdApp>
    </QueryClientProvider>
  );
}

export default App;
