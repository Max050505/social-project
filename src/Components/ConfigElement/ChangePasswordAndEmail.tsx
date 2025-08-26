import CustomInput from "../../UI/Input";

import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import { useChangePassword } from "../../Utils/http";
import style from "./configElement.module.scss";
import { EmailAuthProvider, linkWithCredential } from "firebase/auth";
import { auth } from "../../firebase";

type AuthFormTypes = {
  email: string;
  password: string;
  oldPassword: string;
  newPassword: string;
  oldEmail: string;
};

export default function ChangePasswordAndEmail() {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<AuthFormTypes>();

  const changePassword = useChangePassword();

  const onSubmit: SubmitHandler<AuthFormTypes> = async (data) => {
    try {
      const currentEmail = auth.currentUser?.email;
      if (!currentEmail) throw new Error("No authenticated user");
      const hasPasswordProvider = auth.currentUser?.providerData.some(
        (p) => p.providerId === "password"
      );

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
      reset();
    } catch (err) {
      throw new Error("cant change the password or email");
    }
  };
  return (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            control={control}
            name="oldEmail"
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
                />
                {fieldState.error && <p>{fieldState.error.message}</p>}
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
                />
                {fieldState.error && <p>{fieldState.error.message}</p>}
              </div>
            )}
          />

          
          
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
                />
                {fieldState.error && <p>{fieldState.error.message}</p>}
              </div>
            )}
          />

          <button
            type="submit"
            disabled={isSubmitting || changePassword.isPending}
          >
            {isSubmitting || changePassword.isPending ? "Saving..." : "Save"}
          </button>
        </form>


  );
}
