import { NavLink, useNavigate } from "react-router-dom";
import { Image } from "antd";
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
import { logOut } from "../../Utils/http";
import style from "./SideBar.module.scss";
import { ConfigProvider, Switch, Layout } from "antd";
import Sider from "antd/es/layout/Sider";
import { useEffect, useState } from "react";
import { logos } from "../../UI/logo";
import { auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useAuthReady } from "../../Utils/useAuthChanged";
import { fetchName, fetchEmail } from "../../store/nameAction";
const SideBar = () => {
  const [isDark, setIsDark] = useState(false);
  const [photoURL, setPhotoURL] = useState<string | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const authReady = useAuthReady();
  useEffect(() => {
    console.log("Dispatching fetchEmail and fetchName");
    if (authReady) {
      dispatch(fetchEmail());
      dispatch(fetchName());
    }
  }, [dispatch, authReady]);
  const emailUser = useSelector((state: RootState) => state.email);
  const fullNameUser = useSelector((state: RootState) => state.name);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setPhotoURL(user?.photoURL ?? null);
    });
    return () => unsub();
  }, []);
  const logout = logOut();
  const loginOut = async () => {
    try {
      await logout.mutateAsync();
      navigate("/");
    } catch (err) {
      console.log("Try again, accur some problem with logout");
    }
  };
  return (
    <ConfigProvider
      theme={{
        components: {
          Layout: {
            bodyBg: isDark ? "#1f1f1f" : "#f1f1f1",
            footerBg: isDark ? "#1f1f1f" : "#f1f1f1",
            headerBg: isDark ? "#1f1f1f" : "#f1f1f1",
            siderBg: isDark ? "#1f1f1f" : "#f1f1f1",
          },
        },
      }}
    >
      <Layout className={style.mainBar}>
        <Sider
          className={style.secondBar}
          style={{ width: "25vw", flex: "0 0 25vw", maxWidth: "25vw" }}
        >
          <div className={style.container}>
            <h2 className={isDark ? style.titleDark : style.title}>
              <Image
                src={isDark ? logos[0].image : logos[1].image}
                alt={isDark ? logos[0].alt : logos[1].alt}
                preview={false}
                className={style.mainLogoStyle}
              />
              Social
            </h2>
            <ul>
              <li>
                <NavLink
                  to="/friends"
                  className={`${isDark ? style.dark : style.light} ${
                    style.link
                  }`}
                >
                  {isDark ? (
                    <Image
                      src={logos[4].image}
                      alt={logos[4].alt}
                      preview={false}
                      className={style.logoStyle}
                    />
                  ) : (
                    <Image
                      src={logos[5].image}
                      alt={logos[5].alt}
                      preview={false}
                      className={style.logoStyle}
                    />
                  )}
                  Friends
                </NavLink>
              </li>
              <li>
                {" "}
                <NavLink
                  to="/profile"
                  className={`${isDark ? style.dark : style.light} ${
                    style.link
                  }`}
                >
                  {isDark ? (
                    <Image
                      src={logos[8].image}
                      alt={logos[8].alt}
                      preview={false}
                      className={style.logoStyle}
                    />
                  ) : (
                    <Image
                      src={logos[9].image}
                      alt={logos[9].alt}
                      preview={false}
                      className={style.logoStyle}
                    />
                  )}
                  My profile
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/main"
                  className={`${isDark ? style.dark : style.light} ${
                    style.link
                  }`}
                >
                  {isDark ? (
                    <Image
                      src={logos[2].image}
                      alt={logos[2].alt}
                      preview={false}
                      className={style.logoStyle}
                    />
                  ) : (
                    <Image
                      src={logos[3].image}
                      alt={logos[3].alt}
                      preview={false}
                      className={style.logoStyle}
                    />
                  )}
                  Main
                </NavLink>
              </li>
            </ul>
            <span className={isDark ? style.lineDark : style.line}></span>
            <ul>
              <li>
                <NavLink
                  to="config"
                  className={`${isDark ? style.dark : style.light} ${
                    style.link
                  }`}
                >
                  {isDark ? (
                    <Image
                      src={logos[6].image}
                      alt={logos[6].alt}
                      preview={false}
                      className={style.logoStyle}
                    />
                  ) : (
                    <Image
                      src={logos[7].image}
                      alt={logos[7].alt}
                      preview={false}
                      className={style.logoStyle}
                    />
                  )}
                  Config
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/"
                  className={`${isDark ? style.dark : style.light} ${
                    style.link
                  }`}
                  type="button"
                  onClick={loginOut}
                >
                  <Image
                    src={logos[10].image}
                    alt={logos[10].alt}
                    preview={false}
                    className={style.logoStyle}
                    onClick={loginOut}
                  />
                  Logout
                </NavLink>
              </li>
            </ul>

            <span className={isDark ? style.lineDark : style.line}></span>
            <ul>
              <li>
                <NavLink
                  to="/profile"
                  className={`${isDark ? style.dark : style.light} ${
                    style.link
                  } ${style.person}`}
                >
                  <Image
                    src={photoURL ?? "avatar"}
                    alt="avatar"
                    preview={false}
                    width={60}
                    height={60}
                  />
                  <div>
                    <p>{emailUser}</p>
                    <p>{fullNameUser}</p>
                  </div>
                </NavLink>
              </li>
            </ul>
            <ConfigProvider
              theme={{
                components: {
                  Switch: {
                    handleBg: "#ffffff",
                    colorPrimary: "#515151",
                  },
                },
              }}
            >
              <Switch
                checked={isDark}
                className={style.custom_switch}
                size="small"
                onChange={(checked) => setIsDark(checked)}
              />
            </ConfigProvider>
          </div>
        </Sider>
      </Layout>
    </ConfigProvider>
  );
};

export default SideBar;
