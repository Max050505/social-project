import { Image } from "antd";
import { useLoadingPost, useRemovePost } from "../profileHttp";
import { useEffect, useState } from "react";
import React from "react";
import style from "./postList.module.scss";
import ButtonImage from "../UI/ButtonImage";
export default function PostList() {
  const post = useLoadingPost();
  const removePost = useRemovePost();
  const [isVisible, setIsVisible] = useState<null | number>(null);
  type Item = { id: string; downloadURL: string; storagePath: string };
  const [images, setImages] = useState<Item[]>([]);
  const [liked, setLiked] = useState<Set<number>>(new Set());

  useEffect(() => {
    const items = Array.isArray(post.data) ? post.data : [];
    setImages(items as Item[]);
  }, [post.data]);
  if (post.isLoading) return <p>...Loading</p>;
  if (post.isError) return <p>Error loading posts</p>;
  if (!images.length) return <p>Your posts list is empty</p>;
  console.log("post.data:", post.data);
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
          {images.map((item, index) => (
            <React.Fragment key={index}>
              <li className={style.item}>
                <Image
                  src={item.downloadURL}
                  alt={`post-${index}`}
                  onClick={() => setIsVisible(index)}
                />
              </li>
            </React.Fragment>
          ))}
        </Image.PreviewGroup>
      </ul>
      {isVisible !== null && (
        <div className={style.overlay}>
          <ButtonImage
            className={`${style.actionButton} ${
              liked.has(isVisible) ? style.liked : ""
            }`}
            onClick={() => {
              setLiked((prev) => {
                const next = new Set(prev);
                if (isVisible !== null) {
                  if (next.has(isVisible)) next.delete(isVisible);
                  else next.add(isVisible);
                }
                return next;
              });
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
                storagePath: current.downloadURL,
              });
              if (isVisible === null) return;
              setImages((prev) => {
                const next = prev.filter((_, i) => i !== isVisible);
                setIsVisible((current) => {
                  if (current === null) return null;
                  if (next.length === 0) return null;
                  return Math.min(current, next.length - 1);
                });
                return next;
              });
            }}
          >
            🗑
          </ButtonImage>
        </div>
      )}
    </>
  );
}
