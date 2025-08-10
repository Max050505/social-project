import { NavLink, Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";

import "../App.css";
const HomePage = () => {
  const location = useLocation();
  return (
    <div className="container">
      <>
        {location.pathname === "/registration" && (
          <NavLink to={"auth"} className="nav__link">
            Sign in
          </NavLink>
        )}
        {location.pathname === "/auth" && (
          <NavLink to={"registration"} className="nav__link">
            Registration
          </NavLink>
        )}
        
      </>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default HomePage;
