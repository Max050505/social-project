import { Image } from "antd";
import { useDispatch } from "react-redux";
import type { AppDispatch, RootState } from "../../../store";
import { useAppSelector } from "../../../store";
import { fetchName } from "../../../store/nameAction";
import { auth } from "../../../firebase";
import { useEffect, useRef } from "react";
import { useAuthReady } from "../../../Utils/useAuthChanged";
import { useAvatarAdd, useLoadingAvatar } from "../../../Utils/http";
import { updateProfile } from "firebase/auth";
import style from "./avatar.module.scss";
import AnimateName from "./AnimateName";
import AnimateEmail from "./AnimateEmail";

export default function Avatar() {
  const { firstName, lastName } = useAppSelector((state: RootState) => state.name);
  const email = useAppSelector((state: RootState) => state.email);
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
  const avatarAdd = useAvatarAdd();
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await avatarAdd.mutateAsync({ file });

      if (result?.downloadURL) {
        await showAvatar.refetch?.();
        if (auth.currentUser) {
          await updateProfile(auth.currentUser, { photoURL: result.downloadURL });
          await auth.currentUser.reload();
          dispatch(fetchName());
        }
      }
    } catch (error) {
      console.error("Failed to upload avatar:", error);
    }

    e.target.value = "";
  };
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
        preview={false}
        onClick={handleImageClick}
        
      />
      <div className={style.name}>
        <AnimateName firstName={firstName} lastName={lastName}></AnimateName>
        <AnimateEmail email={email || " no Name"}></AnimateEmail>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
        data-testid = 'avatar-input'
      />
    </div>
  );
}
