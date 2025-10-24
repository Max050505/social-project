import { Image } from "antd";
import { useGetFromRequestUser, useSendToFriends } from "../../../Utils/httpFriendRequest";
import style from "./fromList.module.scss";
import AcceptAndCancelButton from "../../../UI/AcceptAndCancelButton";
import { useRemoveRequestToFriends } from "../../../Utils/httpFriendRequest";
import {Link} from 'react-router-dom';

export default function FromList({userId}: {userId: string}) {
    const { data: fromUser = [], isLoading } = useGetFromRequestUser({userId});
    const cancel = useRemoveRequestToFriends();
    const accept = useSendToFriends();
    function handleCancelRequest(userId: string) {
      cancel.mutate(userId);
    }
    function handleAcceptRequest(userId:string){
        cancel.mutate(userId);
        accept.mutate(
          {userId},{

            onSuccess: () => {cancel.mutate(userId);}
          }
          
        );
    }
    if (isLoading) return <p>Loading requests...</p>;
    if (fromUser.length === 0) return <p>No requests.</p>;
  return (
    <>
      <ul className={style.list}>
        {fromUser.map((user) => (
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
              width={50}
              height={50}
              preview={false}
            />
            <span className={style.userName}>{user.name}</span>
            </Link>
            <div className={style.buttons}>
            <AcceptAndCancelButton
            
              onClick={() => handleCancelRequest(user.id)}
              className={style.cancelButton}
              disabled={cancel.isPending || accept.isPending}
            >
              Cancel
            </AcceptAndCancelButton>
            <AcceptAndCancelButton
              onClick={() => handleAcceptRequest(user.id)}
              className={style.acceptButton}
              disabled={cancel.isPending}
            >
              Accept
            </AcceptAndCancelButton>
            </div>
          </li>
        ))}
      </ul>
      </>
  );
}
