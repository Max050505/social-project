import Avatar from "./Avatar/Avatar";
import ChangeName from "./ChangeName/ChangeName";
import ChangePasswordAndEmail from "./ChangePassword/ChangePasswordAndEmail";
import style from "./configElement.module.scss";
export default function ConfigElement() {
  return (
    <>
      <div className={style.container}>
        <h2>Edit Profile</h2>
        <Avatar />
        <div className={style.changes} style={{ display: 'flex'}}>
          <ChangeName />
          <ChangePasswordAndEmail />
        </div>
      </div>
    </>
  );
}
