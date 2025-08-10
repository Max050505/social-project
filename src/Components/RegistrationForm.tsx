import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import { NavLink } from "react-router-dom";
import CustomInput from "../UI/Input";
import style from "./RegistrationForm.module.scss";
import { registerUser } from "../Utils/authService";
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

  const onSubmit: SubmitHandler<FieldTypes> = async (data) => {
    console.log("Form data being submitted:", data);
    try {
      await registerUser(data.email, data.password);
    
      reset();
    } catch (err: any) {
      console.log('some error with submitting')
    }
  };

  const passwordValue = watch("password");

  return (
    <section className={style.formMain}>
      <div className={style.container}>
        <div className={style.form}>
          <form onSubmit={handleSubmit(onSubmit)}>
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
                      placeholder="Input your first name"
                      status={fieldState.invalid ? "error" : ""}
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
                      placeholder="Input your last name"
                      status={fieldState.invalid ? "error" : ""}
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
                    status={fieldState.invalid ? "error" : ""}
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
                    placeholder="Input your password"
                    status={fieldState.invalid ? "error" : ""}
                    type="password"
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
                    placeholder="Input your password"
                    status={fieldState.invalid ? "error" : ""}
                    type="password"
                  />
                  {fieldState.error && <p>{fieldState.error?.message}</p>}
                </div>
              )}
            />
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Loading..." : "Sign up"}
            </button>
            <NavLink to={"/"}>Sign in</NavLink>
          </form>
        </div>
      </div>
    </section>
  );
};

export default RegistrationForm;
