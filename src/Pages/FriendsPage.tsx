import { useParams } from "react-router-dom";
import MainFriendsElement from "../Components/FriendsElements/MainFriendsElement";

export default function FriendsPage() {
  const { id } = useParams();
  return <MainFriendsElement userId={id || ""} />;
}
