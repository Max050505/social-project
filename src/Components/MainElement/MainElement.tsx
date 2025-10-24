import style from "./mainElement.module.scss";
import { useGetFriendsPosts } from "../../Utils/httpMain";
import {
  useUserLikedPostIds,
  useFetchLike,
  useRemoveLike,
} from "../../Utils/profileHttp";
import { useState, useMemo } from "react";
import { Image } from "antd";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

import PostsAndLikes from "../ProfileElement/Header/PostsAndLikes";
export default function MainElement() {
  const { data: posts, isLoading } = useGetFriendsPosts();
  const { data: likedPostIds = [] } = useUserLikedPostIds();
  const [isVisible, setIsVisible] = useState<null | number>(null);
  const isDark = useSelector((state: RootState) => state.theme.state);
  const like = useFetchLike();
  const unlike = useRemoveLike();
  const handlePutLike = useMemo(
    () => (postId: string, isLiked: boolean, ownerUid: string) => {
      if (isLiked) {
        unlike.mutate({ postId, ownerUid });
      } else {
        like.mutate({ postId, ownerUid });
      }
    },
    [like, unlike]
  );
  if (!posts?.length) return <p>Your posts list is empty</p>;
  if(isLoading) return <p>Wait a second the posts are loading...</p>
  return (
    <main data-testid = "main-container" className={isDark ? style.bgDark : style.bg}>
    <div className={style.container}>
      {!posts?.length ? (
        <p>You have no friends posts</p>
      ) : (
        <ul className={style.list}>
          {posts?.map((post) => (
            <div key={post.id}>
              <div className={style.postAuthor}>
                <NavLink to={post.id}>
                <Image src={post.avatar} width={50} height={50} preview={false} />
                </NavLink>
                <p className={isDark ? style.darkName : ''}>{post.authorFullName}</p>
              </div>

              <PostsAndLikes
                images={[post]}
                likedPostIds={likedPostIds}
                onImageClick={(idx: number) => setIsVisible(idx)}
                onToggleLike={handlePutLike}
                className={style.post}
              />
            </div>
          ))}
        </ul>
      )}
    </div>
    </main>
  );
}
