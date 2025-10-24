import { Image } from "antd";
import { useGetSentFriendRequests } from "../../../Utils/httpFriendRequest";
import style from "./toList.module.scss";
import AcceptAndCancelButton from "../../../UI/AcceptAndCancelButton";
import { useRemoveRequestToFriends } from "../../../Utils/httpFriendRequest";
export default function ToList(_: { userId: string }) {
  const { data: sentRequest = [], isLoading } = useGetSentFriendRequests();
  const cancel = useRemoveRequestToFriends();
  function handleCancelRequest(userId: string) {
    cancel.mutate(userId);
  }
  if (isLoading) return <p>Loading sent requests...</p>;
  if (sentRequest.length === 0) return <p>No sent requests.</p>;
  return (
    <>
      <ul className={style.list}>
        {sentRequest.map((user) => (
          <li className={style.listItem} key={user.id}>
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
            <AcceptAndCancelButton
              onClick={()=>handleCancelRequest(user.id)}
              className={style.cancelButton}
              disabled={cancel.isPending}
            >
              Cancel
            </AcceptAndCancelButton>
          </li>
        ))}
      </ul>
    </>
  );
}
