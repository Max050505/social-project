import { HeartOutlined } from "@ant-design/icons";
import { Image } from "antd";
import { MouseEvent } from "react";
import postStyle from "./postList.module.scss";
import likeStyle from "./PostsAndLikes.module.scss";
import ButtonImage from "../UI/ButtonImage";
import { useIsPostLiked } from "../../../Utils/profileHttp";

type PostItem = {
  id: string;
  downloadURL: string;
  storagePath: string;
  ownerUid: string;
  likesCount: number;
};

type PostsAndLikesProps = {
  images: PostItem[];
  likedPostIds: string[]; 
  onImageClick: (index: number) => void;
  onToggleLike: (postId: string, isLiked: boolean, ownerUid: string) => void;
  className: string;
};

export default function PostsAndLikes({
  images,
  likedPostIds,
  onImageClick,
  onToggleLike,
  className
}: PostsAndLikesProps) {
  return (
    <>
        {images.map((item, index) => {
          return (
            <PostItemWithLike 
              key={item.id}
              item={item}
              index={index}
              className={className}
              onImageClick={onImageClick}
              onToggleLike={onToggleLike}
            />
          );
        })}
    </>
  );
}

function PostItemWithLike({ 
  item, 
  index, 
  className, 
  onImageClick, 
  onToggleLike 
}: {
  item: PostItem;
  index: number;
  className: string;
  onImageClick: (index: number) => void;
  onToggleLike: (postId: string, isLiked: boolean, ownerUid: string) => void;
}) {
  const { data: isLiked = false } = useIsPostLiked(item.id, item.ownerUid);

  return (
    <li className={className}>
      <Image
        src={item.downloadURL}
        alt={`post-${index}`}
        onClick={() => onImageClick(index)}
      />
      <ButtonImage
        className={likeStyle.buttonLike}
        onClick={(e: MouseEvent<HTMLButtonElement>) => {
          e.stopPropagation();
          onToggleLike(item.id, isLiked, item.ownerUid);
        }}
      >
        <HeartOutlined
          className={`${postStyle.heartIcon} ${
            isLiked ? postStyle.heartIconClicked : ""
          }`}
        />
        {item.likesCount}
      </ButtonImage>
    </li>
  );
}
