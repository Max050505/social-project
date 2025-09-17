import style from './PostsCounter.module.scss';
import { useLoadingPost } from "../profileHttp";
export default function PostsCounter({}){

    const post = useLoadingPost();
    if(post.isLoading) {
        return <p>Loading...</p>
    }
    if(post.isError){
        return <p>Error</p>
    }

    const countPost = Array.isArray(post.data) ? post.data.length : 0;

    return (
        <p className={style.count}>{countPost > 0 ? 'Posts' : 'Post'}:{countPost}</p>
    );
}