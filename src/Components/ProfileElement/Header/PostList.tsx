import { Image } from "antd";

import {
  useFetchLike,
  useLoadingPost,
  useRemoveLike,
  useRemovePost,
  useUserLikedPostIds
} from "../../../Utils/profileHttp";
import { useState } from "react";
import style from "./postList.module.scss";
import ButtonImage from "../UI/ButtonImage";
import PostsAndLikes from "./PostsAndLikes";
export default function PostList({userId}: {userId?: string}) {
  const { data: images = [], isPending, isError } = useLoadingPost({userId});
  const like = useFetchLike();
  const unlike = useRemoveLike();
  const removePost = useRemovePost();
  const [isVisible, setIsVisible] = useState<null | number>(null);
  const { data: likedPostIds = [] } = useUserLikedPostIds();
  const currentPost = isVisible !== null ? images[isVisible] : null;
  const isOverlayLiked = currentPost
    ? likedPostIds.includes(currentPost.id)
    : false;
  if (isPending) return <p>...Pending</p>;
  if (isError) return <p>Error loading posts</p>;
  if (!images?.length) return <p>{userId ? 'This user has no posts' : 'Your posts list is empty'}</p>;

  const handlePutLike = (postId: string, isLiked: boolean, ownerUid: string) => {
    if (isLiked) {
      unlike.mutate({ postId, ownerUid });
    } else if (!isLiked) {
      like.mutate({ postId, ownerUid });
    }
  };
  return (
    <>
      <ul className={style.list}>
        <Image.PreviewGroup
          preview={{
            visible: isVisible !== null,
            current: isVisible ?? 0,
            onVisibleChange: (visible) => {
              if (!visible) setIsVisible(null);
            },
            onChange: (current) => {
              setIsVisible(current);
            },
          }}
        >
          <PostsAndLikes
            images={images}
            likedPostIds={likedPostIds}
            onImageClick={(idx) => setIsVisible(idx)}
            onToggleLike={(postId, isLiked, ownerUid) => handlePutLike(postId, isLiked, ownerUid)}
            className={style.item}
          />
        </Image.PreviewGroup>
      </ul>
      
  
      {!userId && isVisible !== null && (
        <div className={style.overlay}>
          <ButtonImage
            className={`${style.actionButton} ${
              isOverlayLiked ? style.liked : ""
            }`}
            onClick={() => {
              if (isVisible !== null) {
                const current = images[isVisible];
                handlePutLike(current.id, isOverlayLiked, current.ownerUid);
              }
            }}
          >
            ❤
          </ButtonImage>
          <ButtonImage
            className={`${style.actionButton} ${style.remove}`}
            onClick={async () => {
              if (isVisible === null) return;
              const current = images[isVisible];
              await removePost.mutateAsync({
                id: current.id,
                storagePath: current.storagePath,
              });
              if (isVisible === null) return;
              setIsVisible((prev) => {
                const remaining = images.length - 1;
                if (remaining <= 0) return null;
                return Math.min(prev ?? 0, remaining - 1);
              });
            }}
          >
            🗑
          </ButtonImage>
        </div>
      )}
      </>
    )}
