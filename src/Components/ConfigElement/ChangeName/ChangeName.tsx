import { Controller, SubmitHandler, useForm } from "react-hook-form";
import CustomInput from "../../../UI/Input";
import { useChangeName } from "../../../Utils/http";
import style from "./changeName.module.scss";
import { Spin } from "antd";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
interface FieldTypes {
  newFirstName: string;
  newLastName: string;
}

export default function ChangeName() {
  const isDark = useSelector((state: RootState) => state.theme.state);
  const [isOpenCard, setIsOpenCard] = useState(false);
  const ChangeName = useChangeName();
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FieldTypes>();
  const onSubmit: SubmitHandler<FieldTypes> = async (data) => {
    await ChangeName.mutateAsync({
      firstName: data.newFirstName,
      lastName: data.newLastName,
    });
  };

  const handleOpenCard = () => {
    setIsOpenCard((prev) => !prev);
  };
  return (
    <>
      <div className={style.card}>
        <h3 className={isDark ? style.text : ''}>If you you want to change name, click here</h3>
        <div className={`${style.inner} ${isOpenCard ? style.flipped : ""}`}>
          <div className={style.front} onClick={handleOpenCard}></div>
          <div className={style.back} onClick={handleOpenCard}>
            {isSubmitting ? (
              <Spin />
            ) : (
              <form onSubmit={handleSubmit(onSubmit)}>
                <div onClick={(e) => e.stopPropagation()} className={style.flex}>
                  <Controller
                    control={control}
                    name="newFirstName"
                    rules={{
                      required:
                        "if you want to change your name, input new name here",
                    }}
                    render={({ field, fieldState }) => (
                      <div>
                        <CustomInput
                          {...field}
                          status={fieldState.invalid ? "error" : ""}
                          placeholder="first name"
                          label="first name"
                        />
                        {fieldState.error && <p>{fieldState.error?.message}</p>}
                      </div>
                    )}
                  />
                  <Controller
                    control={control}
                    name="newLastName"
                    rules={{
                      required:
                        "if you want to change your last name, input a new last name here",
                    }}
                    render={({ field, fieldState }) => (
                      <div>
                        <CustomInput
                          {...field}
                          status={fieldState.invalid ? "error" : ""}
                          placeholder="last name"
                          label="last name"
                        />
                        {fieldState.error && <p>{fieldState.error?.message}</p>}
                      </div>
                    )}
                  />{" "}
                <button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save"}
                </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
