import { Image } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import { useAuthReady } from "../../../Utils/useAuthChanged";
import { useEffect } from "react";
import { fetchName } from "../../../store/nameAction";
import { useLoadingAvatar } from "../../../Utils/http";
import style from "./AvatarProfile.module.scss";
import AddButtonPost from "./AddButtonPost";
import PostsCounter from "./PostsCounter";

export default function AvatarProfile() {
  const isDark = useSelector((state:RootState) => state.theme.state);
  const dispatch = useDispatch<AppDispatch>();
  const showAvatar = useLoadingAvatar();
  const { firstName, lastName } = useSelector((state: RootState) => state.name);
  const authReady = useAuthReady();

  useEffect(() => {
    if (!authReady) return;
    dispatch(fetchName());
  }, [dispatch, authReady]);

  return (
    <div className={isDark ? `${style.avatarDark} ${style.avatar}` : `${style.avatar}`}>
      <Image
        src={
          showAvatar.data
            ? `${showAvatar.data}?t=${Date.now()}`
            : "https://placehold.co/100x100?text=No+Image"
        }
        alt="profile-avatar"
        width={200}
        height={200}
        preview={false}
      />
      <div className={style.name}>
        <p className={style.names}>
          {firstName}
          <span> &nbsp;</span>
          {lastName}
        </p>
        <ul className={style.tegs}>
          <li><PostsCounter /></li>
          <li>Followers</li>
          <li>Follow</li>
        </ul>
        <div className={style.btn_box}>
          <AddButtonPost />
        </div>
      </div>
    </div>
  );
}
