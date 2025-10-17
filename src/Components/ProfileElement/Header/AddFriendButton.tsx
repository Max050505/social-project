import { useSendRequestToFriend, useGetFriendsUser, useGetFromRequestUser, useGetSentFriendRequests} from "../../../Utils/httpFriendRequest";
import { useCurrentUser } from "../../../Utils/http";
import { message } from "antd";
import style from "./AddFriendButton.module.scss"
export default function AddFriendButton({userId}: {userId: string}){
    const [messageApi, contextHolder] = message.useMessage();
    const { data: currentUser } = useCurrentUser();
    const sendRequest = useSendRequestToFriend({ messageApi });
    const { data: friends = [] } = useGetFriendsUser({ userId: currentUser?.uid || "" });
    const { data: sent = [] } = useGetSentFriendRequests();
    const { data: received = [] } = useGetFromRequestUser({ userId: currentUser?.uid || "" });

    const isFriend = friends.some((friend) => friend.id === userId)
    const isSent= friends.some((sent) => sent.id === userId)
    const isReceived= friends.some((received) => received.id === userId)
    const handleSendRequest = async () => {
     await sendRequest.mutateAsync({userId})
    }
    let buttonText = 'Add Friend';
    let buttonDisebled = false;
    
    if(isFriend){
        buttonText = 'Friends';
        buttonDisebled = true;
    }else if(isSent) {
        buttonText = 'Request Sent';
        buttonDisebled = true;
    } else if(isReceived){
        buttonText = 'Request Received';
        buttonDisebled = true;
    }
    return <>
    {contextHolder}
     <button onClick={() => handleSendRequest()} className={style.btn} disabled= {buttonDisebled}> {sendRequest.isPending ? "Sending..." : buttonText}</button>
    </>
}