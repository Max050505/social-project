import AvatarProfile from "./Header/AvatarProfile";
import style from "./profileElement.module.scss";
import PostList from './Header/PostList';
import { useSelector } from "react-redux";
import { RootState } from "../../store";

type ProfileElementProps = {
    userId?: string;
};

export default function ProfileElement({ userId: userId }: ProfileElementProps){
    const isDark = useSelector((state: RootState) => state.theme.state);
    return (
        <div className={isDark ? style.bgDark : style.bg}>
        <div className={style.container}>
            <AvatarProfile userId = {userId}/>
            <span className={style.line}></span>
            <PostList userId = {userId}/>
        </div>
        </div>
    );
}