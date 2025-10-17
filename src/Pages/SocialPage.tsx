import { Outlet } from "react-router-dom";
import SideBar from "../Components/SideBar/SideBar";
import NotificationButton from "../Components/SideBar/NotificationButton";
export default function SocialPage() {
  return (
    <>
      
      <SideBar />
      <NotificationButton />
      <main>
        <Outlet />
      </main>
    </>
  );
}
