import { Controller, SubmitHandler, useForm } from "react-hook-form";
import CustomInput from "../../UI/Input";
import { useChangeName } from "../../Utils/http";
import style from './configElement.module.scss'
interface FieldTypes {
  newFirstName: string;
  newLastName: string;
}

export default function ChangeName() {
    const ChangeName = useChangeName();
  const { control, handleSubmit,formState: { isSubmitting } } = useForm<FieldTypes>();
  const onSubmit: SubmitHandler<FieldTypes> = async(data) => {
    await ChangeName.mutateAsync({
        firstName: data.newFirstName,
        lastName: data.newLastName,
    })
  }
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className={style.form}>
        <Controller
          control={control}
          name="newFirstName"
          rules={{
            required: "if you want to change your name, input new name here",
          }}
          render={({ field, fieldState }) => (
            <div>
              <CustomInput
                {...field}
                status={fieldState.invalid ? "error" : ""}
                placeholder="Input your first name"
                
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
                placeholder="Input your last name"
              />
              {fieldState.error && <p>{fieldState.error?.message}</p>}
            </div>
          )}
        />
        <button
          type="submit"
          disabled={
            isSubmitting 
          }
        >
          {isSubmitting 
            ? "Saving..."
            : "Save"}
        </button>
      </form>
    </>
  );
}
