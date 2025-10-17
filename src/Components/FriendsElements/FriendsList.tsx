import { Image } from "antd";
import { useGetFriendsUser, useRemoveFromFriends } from "../../Utils/httpFriendRequest";
import style from "./friendsList.module.scss";
import { Link } from "react-router-dom";
import { DeleteFilled } from "@ant-design/icons";
import AcceptAndCancelButton from "../../UI/AcceptAndCancelButton";
export default function FriendsList({ userId }: { userId: string }) {
  const { data: friend = [], isLoading } = useGetFriendsUser({ userId });
  const remove = useRemoveFromFriends();
  function handleRemoveFriend(friendId: string){
    remove.mutate(friendId)
  }
  if (isLoading) return <p>Loading sent requests...</p>;
  if (friend.length === 0) return <p>No friends.</p>;
  return (
    <>
      <ul className={style.list}>
        {friend.map((user) => (
          <li className={style.listItem} key={user.id}>
              <Link to={`/profile/${user.id}`} >
              <Image
                src={
                  user.avatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user.name
                  )}`
                }
                alt="avatar"
                width={30}
                height={30}
                preview={false}
              />
              <span className={style.userName}>{user.name}</span>
          </Link>
              <AcceptAndCancelButton className={style.removeButton} disabled={remove.isPending} onClick={()=>handleRemoveFriend(user.id)} ><DeleteFilled/></AcceptAndCancelButton>
              
            </li>
        ))}
      </ul>
    </>
  );
}
