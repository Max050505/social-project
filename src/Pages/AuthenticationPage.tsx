import { useNavigate } from "react-router-dom";
import AuthForm from "../Components/AuthForm";
import { useCurrentUser } from "../Utils/http";
import { useEffect } from "react";

export default function AuthenticationPage() {
  const navigate = useNavigate();

  const { isLoading, data: user } = useCurrentUser();

  useEffect(() => {
    if (user) {
      navigate("/welcome");
    }
  }, [user, navigate]);
  return (
    <div>
      {isLoading && <p>Завантажуєм сторінку...</p>}

      <AuthForm></AuthForm>
    </div>
  );
}
