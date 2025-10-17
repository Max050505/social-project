import style from './PostsCounter.module.scss';
import { useLoadingPost } from "../../../Utils/profileHttp";
export default function PostsCounter({userId}: {userId?: string}){

    const post = useLoadingPost({userId});
    if(post.isLoading) {
        return <p>Loading...</p>
    }
    if(post.isError){
        return <p>Error</p>
    }

   const count = post.data?.length ?? 0; 

    return (
        <p className={style.count}>{count === 0 ? 'Post' : 'Posts'}:{count}</p>
    );
}