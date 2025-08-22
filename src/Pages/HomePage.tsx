import { Outlet } from "react-router-dom";


import "../App.css";
const HomePage = () => {
  return (
    <div className="container">

      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default HomePage;
