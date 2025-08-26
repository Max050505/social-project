import Avatar from "./Avatar";
import ChangeName from "./ChangeName";
import ChangePasswordAndEmail from "./ChangePasswordAndEmail";
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
