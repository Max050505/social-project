import CustomInput from "../../../UI/Input";

import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import { useChangePassword } from "../../../Utils/http";
import { handleVerify } from "../Utils/http";
import { useState } from "react";
import style from "./changePasswordAndEmail.module.scss";
import { EmailAuthProvider, linkWithCredential } from "firebase/auth";
import { auth } from "../../../firebase";
import { message, Spin } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

type AuthFormTypes = {
  email: string;
  oldPassword: string;
  newPassword: string;
};

export default function ChangePasswordAndEmail() {
  const isDark = useSelector((state: RootState) => state.theme.state);
  const [isVerify, setIsVerify] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    reset,
    setError,
    getValues,
    trigger,
  } = useForm<AuthFormTypes>();

  const changePassword = useChangePassword();

  const currentEmail = auth.currentUser?.email;
  const hasPasswordProvider = auth.currentUser?.providerData.some(
    (p) => p.providerId === "password"
  );
  const onSubmit: SubmitHandler<AuthFormTypes> = async (data) => {
    try {
      if (!currentEmail) throw new Error("No authenticated user");

      if (!hasPasswordProvider) {
        await linkWithCredential(
          auth.currentUser!,
          EmailAuthProvider.credential(currentEmail, data.newPassword)
        );
      }

      if (hasPasswordProvider) {
        await changePassword.mutateAsync({
          oldPassword: data.oldPassword,
          email: data.email,
          newPassword: data.newPassword,
        });
      }
      message.success("Your password is changed");
      reset();
    } catch (err: any) {
      setError("oldPassword", {
        type: "manual",
        message: err?.message || "cant change the password or email",
      });
    }
  };

  const handleVerifyClick = async () => {
    const { email, oldPassword } = getValues();
    const valid = await trigger(["email", "oldPassword"]);
    if (!valid) return;
    try {
      await handleVerify(email, oldPassword);
      setIsVerify(true);
    } catch (err: any) {
      setError("oldPassword", {
        type: "manual",
        message: err?.message || "Verification failed",
      });
    }
  };

  const handleFlipp = () => {
    setIsOpen((prev) => !prev);
  };
  return (
    <div className={style.card}>
      <h3 className={isDark ? style.text : ''}>If you you want to change password, click here</h3>
      <div className={`${style.inner} ${isOpen ? style.flipped : ""}`}>
        <div className={style.front} onClick={handleFlipp}></div>
        <div className={style.back} onClick={handleFlipp}>
          {isSubmitting || changePassword.isPending ? (
            <Spin />
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <div onClick={(e) => e.stopPropagation()} className={style.flex}>
                {!isVerify && (
                  <>
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
                          <label>Current Email</label>
                          <CustomInput
                            {...field}
                            placeholder="email"
                            status={fieldState.invalid ? "error" : ""}
                            data-testid="email"
                          />
                          {fieldState.error && (
                            <p>{fieldState.error.message}</p>
                          )}
                        </div>
                      )}
                    />
                    <Controller
                      control={control}
                      name="oldPassword"
                      rules={{
                        required: "Input your password",
                        minLength: {
                          value: 6,
                          message: "Password must be 6 or more symbols.",
                        },
                      }}
                      render={({ field, fieldState }) => (
                        <div>
                          <label>Current Password</label>
                          <CustomInput
                            {...field}
                            placeholder="password"
                            type="password"
                            status={fieldState.invalid ? "error" : ""}
                            data-testid="oldPassword"
                          />
                          {fieldState.error && (
                            <p>{fieldState.error.message}</p>
                          )}
                        </div>
                      )}
                    />
                  </>
                )}
              
              {isVerify && (
                <Controller
                  control={control}
                  name="newPassword"
                  rules={{
                    required: "Input your password",
                    minLength: {
                      value: 6,
                      message: "Password must be 6 or more symbols.",
                    },
                  }}
                  render={({ field, fieldState }) => (
                    <div>
                      <label>New Password</label>
                      <CustomInput
                        {...field}
                        placeholder="password"
                        type="password"
                        status={fieldState.invalid ? "error" : ""}
                        data-testid="newPassword"
                      />
                      {fieldState.error && <p>{fieldState.error.message}</p>}
                    </div>
                  )}
                />
              )}
                {!isVerify ? (
                  <button type="button" onClick={handleVerifyClick}>
                    confirm
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting || changePassword.isPending}
                  >
                    {isSubmitting || changePassword.isPending
                      ? "Saving..."
                      : "Save"}
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
