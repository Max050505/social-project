import Avatar from "./Avatar/Avatar";
import ChangeName from "./ChangeName/ChangeName";
import ChangePasswordAndEmail from "./ChangePassword/ChangePasswordAndEmail";
import style from "./configElement.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
export default function ConfigElement() {
  const isDark = useSelector((state: RootState) => state.theme.state)
  return (
    <div className={isDark ? style.bgDark : style.bg}>
      <div className={style.container}>
        <h2 className={isDark ? style.title : ''}>Edit Profile</h2>
        <Avatar />
        <div className={style.changes} style={{ display: 'flex'}}>
          <ChangeName />
          <ChangePasswordAndEmail />
        </div>
      </div>
    </div>
  );
}
