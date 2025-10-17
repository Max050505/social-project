import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import CustomInput from "../../UI/Input";
import style from "./RegistrationForm.module.scss";
import { registerUser } from "../../Utils/authService";
import { sendName } from "../../Utils/http";
type FieldTypes = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const RegistrationForm = () => {
  const {
    control,
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FieldTypes>();
  const navigate = useNavigate();
  const { mutateAsync: sendNameMutation } = sendName();
  const onSubmit: SubmitHandler<FieldTypes> = async (data) => {
    console.log("Form data being submitted:", data);
    try {
      await registerUser(data.email, data.password);
      await sendNameMutation({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
      });
      navigate("/");
      reset();
    } catch (err: any) {
      console.error("Registration or saving name failed:", err);
    }
  };

  const passwordValue = watch("password");

  return (
    <section className={style.formMain}>
      <div className={style.container}>
        <div className={style.form}>
          <motion.form
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleSubmit(onSubmit)}
            >
            <h2>Create your account here</h2>
            <div className={style.lastFirstName}>
              {/* FIRSTNAME */}
              <Controller
                control={control}
                name="firstName"
                rules={{ required: "It is require field " }}
                render={({ field, fieldState }) => (
                  <div>
                    <CustomInput
                      {...field}
                      data-testid="first-name"
                      placeholder="Input your first name"
                      status={fieldState.invalid ? "error" : ""}
                      value={field.value}
                      onChange={field.onChange}
                    />
                    {fieldState.error && <p>{fieldState.error?.message}</p>}
                  </div>
                )}
              />

              {/* LASTNAME */}
              <Controller
                control={control}
                name="lastName"
                rules={{ required: "Input your last name" }}
                render={({ field, fieldState }) => (
                  <div>
                    <CustomInput
                      {...field}
                      data-testid="last-name"
                      placeholder="Input your last name"
                      status={fieldState.invalid ? "error" : ""}
                      value={field.value}
                      onChange={field.onChange}
                    />
                    {fieldState.error && <p>{fieldState.error?.message}</p>}
                  </div>
                )}
              />
            </div>

            {/* EMAIL */}
            <Controller
              control={control}
              name="email"
              rules={{
                required: "Input this field with your email",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Incorrect email",
                },
              }}
              render={({ field, fieldState }) => (
                <div>
                  <CustomInput
                    {...field}
                    placeholder="Input your email"
                    data-testid="email"
                    status={fieldState.invalid ? "error" : ""}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                  {fieldState.error && <p>{fieldState.error?.message}</p>}
                </div>
              )}
            />

            {/* PASSWORD */}
            <Controller
              control={control}
              name="password"
              rules={{
                required: "Input password",
                minLength: {
                  value: 6,
                  message: "password must to conclude 6 symbols",
                },
              }}
              render={({ field, fieldState }) => (
                <div>
                  <CustomInput
                    {...field}
                    data-testid="password"
                    placeholder="Input your password"
                    status={fieldState.invalid ? "error" : ""}
                    type="password"
                    value={field.value}
                    onChange={field.onChange}
                  />
                  {fieldState.error && <p>{fieldState.error?.message}</p>}
                </div>
              )}
            />

            {/* CONFIRMPASSWORD */}

            <Controller
              control={control}
              name="confirmPassword"
              rules={{
                required: "Confirm password",
                validate: (value) =>
                  value === passwordValue || "input valid password",
              }}
              render={({ field, fieldState }) => (
                <div>
                  <CustomInput
                    {...field}
                    data-testid="confirm-password"
                    placeholder="Input your password"
                    status={fieldState.invalid ? "error" : ""}
                    type="password"
                    value={field.value}
                    onChange={field.onChange}
                  />
                  {fieldState.error && <p>{fieldState.error?.message}</p>}
                </div>
              )}
            />
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Loading..." : "Sign up"}
            </button>
            <NavLink to={"/main"}>Sign in</NavLink>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default RegistrationForm;
