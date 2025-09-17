import AvatarProfile from "./Header/AvatarProfile";
import style from "./profileElement.module.scss";
import PostList from './Header/PostList';
import { useSelector } from "react-redux";
import { RootState } from "../../store";
export default function ProfileElement(){
    const isDark = useSelector((state: RootState) => state.theme.state);
    return (
        <div className={isDark ? style.bgDark : style.bg}>
        <div className={style.container}>
            <AvatarProfile/>
            <p>Avatar+describe(email,name, maybe followers counter)</p>
            <PostList/>
        </div>
        </div>
    );
}