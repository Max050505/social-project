import { Image } from "antd";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store";
import { fetchName } from "../../../store/nameAction";
import { auth } from "../../../firebase";
import { useEffect, useRef } from "react";
import { useAuthReady } from "../../../Utils/useAuthChanged";
import { useAvatarAdd, useLoadingAvatar } from "../../../Utils/http";
import { updateProfile } from "firebase/auth";
import style from "./avatar.module.scss";

export default function Avatar() {
  const { firstName, lastName } = useSelector((state: RootState) => state.name);
  const email = useSelector((state: RootState) => state.email);
  const dispatch = useDispatch<AppDispatch>();
  const authReady = useAuthReady();

  useEffect(() => {
    if (authReady) {
      dispatch(fetchName());
    }
  }, [dispatch, authReady]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const showAvatar = useLoadingAvatar();
  const handleFileChange = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await avatarAdd.mutateAsync({ file });

      if (auth.currentUser && result?.downloadURL) {
        await updateProfile(auth.currentUser, { photoURL: result.downloadURL });

        // Wait a bit longer for storage to update
        await new Promise((res) => setTimeout(res, 400));
        await showAvatar.refetch?.();

        await auth.currentUser.reload();
        dispatch(fetchName());
      }
    } catch (error) {
      console.error("Failed to upload avatar:", error);
    }

    e.target.value = "";
  };
  const avatarAdd = useAvatarAdd();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  return (
    <div className={style.avatar}>
      <Image
        className={style.avatarImage}
        key={showAvatar.data}
        src={
          showAvatar.data
            ? `${showAvatar.data}?t=${Date.now()}`
            : "https://placehold.co/100x100?text=No+Image"
        }
        alt="avatar"
        width={100}
        height={100}
        preview={true}
        onClick={handleImageClick}
      />
      <div className={style.name}>
        <p>
          {firstName} {lastName}
        </p>
        <p>{email || " no Name"}</p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
    </div>
  );
}
