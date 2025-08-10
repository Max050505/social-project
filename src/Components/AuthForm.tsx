import style from "./AuthForm.module.scss";
import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import { NavLink, useNavigate, } from "react-router-dom";
import { Image } from "antd";
import photo from "../assets/depositphotos_3380237-stock-photo-gold-wheat-and-blue-sky.jpg";
import CustomInput from "../UI/Input";
import { signInUser } from "../Utils/authService";
type AuthFormTypes = {
  email: string;
  password: string;
};

const AuthForm = () => {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<AuthFormTypes>();

  const navigate = useNavigate();
  const onSubmit: SubmitHandler<AuthFormTypes> = async (data) => {
    try {
      await signInUser(data.email, data.password);
       reset();
       navigate('/welcome');
    } catch (err: any) {
      console.log('login error')
    }
  };

  return (
    <section className={style.mainClass}>
      <div className={style.container}>
        <div className={style.image}>
          <Image src={photo} preview={false} alt="login-photo" />
        </div>
        <div className={style.form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <h2 className={style.title}>Login</h2>
            {/* EMAIL */}
            <Controller
              control={control}
              name="email"
              rules={{
                required: "You must input email address",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Incorrect email",
                },
              }}
              render={({ field, fieldState }) => (
                <div>
                  <label>Email</label>
                  <CustomInput
                    {...field}
                    placeholder="email"
                    status={fieldState.invalid ? "error" : ""}
                  />
                  {fieldState.error && <p>{fieldState.error?.message}</p>}
                </div>
              )}
            />

            {/* Password */}

            <Controller
              control={control}
              name="password"
              rules={{
                required: "Input your password",
                minLength: {
                  value: 6,
                  message: "Password must be 6 or more symbols.",
                },
              }}
              render={({ field, fieldState }) => (
                <div>
                  <label>Password</label>
                  <CustomInput
                    {...field}
                    placeholder="password"
                    status={fieldState.invalid ? "error" : ""}
                  />
                  {fieldState.error && <p>{fieldState.error?.message}</p>}
                </div>
              )}
            />

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Loading..." : "Sign in"}
            </button>
          </form>
          <p>
            Dont have an account?{" "}
            <NavLink to={"/registration"}>Sign up</NavLink>
          </p>
        </div>
        
      </div>
    </section>
  );
};

export default AuthForm;
