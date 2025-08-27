import { signInUser } from "../../Utils/authService";
import style from "./AuthForm.module.scss";
import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink, useNavigate } from "react-router-dom";
import CustomInput from "../../UI/Input";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
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
  const currentWall = useSelector((state: RootState) => state.wall.walls[state.wall.currentWallIndex].image)
  const navigate = useNavigate();
  const onSubmit: SubmitHandler<AuthFormTypes> = async (data) => {
    try {
      await signInUser(data.email, data.password);
      reset();
      navigate("/welcome");
    } catch (err: any) {
      console.log("login error");
    }
  };

  return (
    <section className={style.mainClass}>
      <div className={style.container}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className={style.image}
        >
          <img className={style.image} src={currentWall}  alt="login-photo" />
        </motion.div>
        <div className={style.form}>
          <motion.form
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            onSubmit={handleSubmit(onSubmit)}
          >
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
                    data-testid="email"
                    value={field.value}
                    onChange={field.onChange}
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
                    data-testid="password"
                    value={field.value}
                    onChange={field.onChange}
                    status={fieldState.invalid ? "error" : ""}
                  />
                  {fieldState.error && <p>{fieldState.error?.message}</p>}
                </div>
              )}
            />

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Loading..." : "Sign in"}
            </button>
          </motion.form>
          <p>
            Dont have an account?
            <NavLink to={"/registration"}>Sign up</NavLink>
          </p>
        </div>
      </div>
    </section>
  );
};

export default AuthForm;
