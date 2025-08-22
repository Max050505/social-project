import { Outlet } from "react-router-dom";
import SideBar from "../Components/SideBar/SideBar";
export default function SocialPage() {
  return (
    <>

      <SideBar />
      <main>
        <Outlet />
      </main>
    </>
  );
}
