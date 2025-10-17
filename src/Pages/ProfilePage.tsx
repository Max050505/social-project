import ProfileElement from "../Components/ProfileElement/ProfileElement";
import { useParams } from "react-router-dom";
import { useCurrentUser } from "../Utils/http";
import { Navigate } from "react-router-dom";

export default function ProfilePage() {
  const { id } = useParams();
  const { data: currentUser } = useCurrentUser();

  if (id && currentUser && id === currentUser.uid) {
    return <Navigate to="/profile" replace />;
  }
  
  return (
    <>
      <div>
        {!id ? <ProfileElement/> : <ProfileElement userId={id}/>}
      </div>
    </>
  );
}
