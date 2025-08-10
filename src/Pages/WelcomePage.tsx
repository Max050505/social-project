import { logOut } from "../Utils/http";
import { useNavigate } from "react-router-dom";
const WelcomePage = () => {
  const navigate = useNavigate();
  const logout = logOut();
  const loginOut = async () => {
    try {
      await logout.mutateAsync();
      navigate("/");
    } catch (err) {
      console.log("Try again, accur some problem with logout");
    }
  };
  return (
    <>
      <button onClick={loginOut}>Exit</button>
      <h1>Welcome</h1>
    </>
  );
};

export default WelcomePage;
