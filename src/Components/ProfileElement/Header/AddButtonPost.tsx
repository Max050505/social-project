import { useRef } from "react";
import { fetchPost, useLoadingPost } from "../../../Utils/profileHttp";
import { auth } from "../../../firebase";
import { updateProfile } from "firebase/auth";
import style from "./AddButtonPost.module.scss";
import { Spin } from "antd";
import AddFriendButton from "./AddFriendButton";
export default function AddButtonPost({ userId }: { userId?: string }) {
  const filePost = useRef<HTMLInputElement | null>(null);
  const handleAddPost = () => {
    filePost.current?.click();
  };
  const showPost = useLoadingPost({ userId });
  const postMutation = fetchPost();
  const handleAddChangePost = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const result = await postMutation.mutateAsync({ file });
      if (auth.currentUser && result?.downloadURL) {
        await updateProfile(auth.currentUser, { photoURL: result.downloadURL });
        await showPost.refetch?.();

        await auth.currentUser.reload();
      }
    } catch (error) {
      console.error("failed to upload posts:", error);
    }
  };
  return (
    <>
      {userId ? (
        <AddFriendButton userId = {userId}  />
      ) : (
        <button
          onClick={handleAddPost}
          className={style.btn}
          disabled={postMutation.isPending}
        >
          {postMutation.isPending ? <Spin /> : "Add post"}
        </button>
      )}

      <input
        ref={filePost}
        onChange={handleAddChangePost}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        data-testid="post-input"
      />
    </>
  );
}
