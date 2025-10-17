import { Image } from "antd";
import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector } from "../../../store";
import { useAuthReady } from "../../../Utils/useAuthChanged";
import { useEffect } from "react";
import { fetchName } from "../../../store/nameAction";
import { useLoadingAvatar } from "../../../Utils/http";
import style from "./AvatarProfile.module.scss";
import AddButtonPost from "./AddButtonPost";
import PostsCounter from "./PostsCounter";
import { useGetOtherName } from "../../../Utils/profileHttp";

export default function AvatarProfile({ userId }: { userId?: string }) {
  const isDark = useAppSelector((state) => state.theme.state);
  const dispatch = useDispatch<AppDispatch>();
  const showAvatar = useLoadingAvatar({ userId });
  const { firstName, lastName } = useAppSelector((state) => state.name);
  const authReady = useAuthReady();
  const { data: otherName } = useGetOtherName(userId);
  useEffect(() => {
    if (!authReady || !userId) return;
    dispatch(fetchName());
  }, [dispatch, authReady, userId]);

 

  return (
    <>
        <div
          className={
            isDark ? `${style.avatarDark} ${style.avatar}` : `${style.avatar}`
          }
        >
          <Image
            src={
              showAvatar.data ||
                 "https://placehold.co/100x100?text=No+Image"
            }
            alt="profile-avatar"
            width={200}
            height={200}
            preview={false}
          />
          <div className={style.name}>
            <p className={style.names}>
              {userId ? otherName?.firstName : firstName}
              <span> &nbsp;</span>
              {userId ? otherName?.lastName : lastName}
            </p>
            <ul className={style.tegs}>
              <li>
                <PostsCounter userId={userId} />
              </li>
              <li>Followers</li>
              <li>Follow</li>
            </ul>
            <div className={style.btn_box}>
              <AddButtonPost userId={userId} />
            </div>
          </div>
        </div>

    </>
  );
}
