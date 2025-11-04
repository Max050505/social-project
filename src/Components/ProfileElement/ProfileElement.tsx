import AvatarProfile from "./Header/avatarProfile/AvatarProfile";
import style from "./profileElement.module.scss";
import PostList from './Header/postList/PostList';
import { useSelector } from "react-redux";
import { RootState } from "../../store";

type ProfileElementProps = {
    userId?: string;
};

export default function ProfileElement({ userId: userId }: ProfileElementProps){
    const isDark = useSelector((state: RootState) => state.theme.state);
    return (
        <div data-testid = "main-container" className={isDark ? style.bgDark : style.bg}>
        <div className={style.container}>
            <AvatarProfile userId = {userId}/>
            <span data-testid="profile-line" className={style.line}></span>
            <PostList userId = {userId}/>
        </div>
        </div>
    );
}