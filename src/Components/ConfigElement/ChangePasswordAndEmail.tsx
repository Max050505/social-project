import CustomInput from "../../UI/Input";
import { Image } from "antd";
import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import {
  useAvatarAdd,
  useChangeEmail,
  useChangePassword,
} from "../../Utils/http";
import style from "./configElement.module.scss";
import {
  updateProfile,
  EmailAuthProvider,
  linkWithCredential,
} from "firebase/auth";
import { useEffect, useRef } from "react";
import { auth } from "../../firebase";
import { fetchName, fetchEmail } from "../../store/nameAction";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch,  RootState} from "../../store";
import { useAuthReady } from "../../Utils/useAuthChanged";
type AuthFormTypes = {
  email: string;
  password: string;
  oldPassword: string;
  newPassword: string;
  oldEmail: string;
  newEmail: string;
};

export default function ChangePasswordAndEmail() {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<AuthFormTypes>();
  const dispatch = useDispatch<AppDispatch>();
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
  const changeEmail = useChangeEmail();
  const changePassword = useChangePassword();

  const avatarAdd = useAvatarAdd();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const result = await avatarAdd.mutateAsync({ file });

    if (auth.currentUser && result?.downloadURL) {
      await updateProfile(auth.currentUser, { photoURL: result.downloadURL });
    }
    e.target.value = "";
  };

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

      await changeEmail.mutateAsync({
        oldEmail: currentEmail,
        password: hasPasswordProvider ? data.oldPassword : data.newPassword,
        newEmail: data.email,
      });

      const latestEmail = auth.currentUser?.email || data.email;
      if (hasPasswordProvider) {
        await changePassword.mutateAsync({
          oldPassword: data.oldPassword,
          email: latestEmail,
          newPassword: data.newPassword,
        });
      }
      reset();
    } catch (err) {
      throw new Error("cant change the password or email");
    }
  };
  return (
    <div className={style.container}>
      <h2>Edit Profile</h2>
      <div className={style.avatar}>
        <Image
          className={style.avatarImage}
          src={
            avatarAdd.data?.downloadURL ||
            auth.currentUser?.photoURL ||
            "https://placehold.co/100x100?text=No+Image"
          }
          alt="avatar"
          width={100}
          height={100}
          preview={true}
          onClick={handleImageClick}
        />
        <div className={style.name}>
          <p>{emailUser || "noEmail"}</p>
          <p>{fullNameUser || " no Name"}</p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </div>
      <div>
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
            disabled={
              isSubmitting || changeEmail.isPending || changePassword.isPending
            }
          >
            {isSubmitting || changeEmail.isPending || changePassword.isPending
              ? "Saving..."
              : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
}
