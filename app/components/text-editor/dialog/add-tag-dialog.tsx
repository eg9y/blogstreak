import { Dispatch } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import { useGetTopicsQuery } from "@/utils/hooks/query/use-get-tags";
import { useUser } from "@/utils/getUser";
import { useCreateTag } from "@/utils/hooks/mutation/use-create-tag";
import { cn } from "@/utils/cn";
import { presetColors } from "@/utils/presetColors";

import { Badge } from "../../badge";
import { Dialog, DialogActions, DialogBody, DialogTitle } from "../../dialog";
import { Field, FieldGroup, Fieldset, Label } from "../../fieldset";
import { Input } from "../../input";
import { Button } from "../../button";

type InsertTagInputs = {
  name: string;
  color: string;
};

export function AddTagDialog({
  openAddTagDialog,
  setOpenAddTagDialog,
}: {
  openAddTagDialog: boolean;
  setOpenAddTagDialog: Dispatch<boolean>;
}) {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<InsertTagInputs>({
    defaultValues: {
      name: "",
      color: "",
    },
  });

  const { loggedInUser } = useUser();
  const { data, isSuccess } = useGetTopicsQuery(loggedInUser);
  const useCreateTagMutation = useCreateTag();

  const onSubmit: SubmitHandler<InsertTagInputs> = (submitData) => {
    useCreateTagMutation.mutate(
      {
        name: submitData.name,
        hexColor: submitData.color,
      },
      {
        onSuccess() {
          setOpenAddTagDialog(false);
        },
      },
    );
  };

  return (
    <Dialog
      open={openAddTagDialog}
      onClose={setOpenAddTagDialog}
      className="z-[52]"
    >
      <DialogTitle>Tags</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogBody className="mt-[0.75rem] flex flex-col gap-2">
          <p className="text-sm dark:text-slate-50">Existing Tags </p>
          <div className=" flex items-center gap-1">
            {isSuccess && data?.length === 0 && (
              <p className="text-sm text-slate-700">
                No Tags have been created
              </p>
            )}
            {isSuccess &&
              data?.map((topic) => {
                return (
                  <Badge key={topic.name} color={topic.color as any}>
                    {topic.name}
                  </Badge>
                );
              })}
          </div>

          <Fieldset className="flex flex-col gap-4">
            <FieldGroup>
              <Field>
                <Label>Tag</Label>
                <Controller
                  control={control}
                  name="name"
                  rules={{
                    required: "Please write a name",
                  }}
                  render={({ field: { onChange, value } }) => (
                    <Input onChange={onChange} value={value} />
                  )}
                />
                {errors.name && (
                  <p className="text-red-600 dark:text-red-500">
                    {errors.name.message}
                  </p>
                )}
              </Field>
              <Field>
                <Label>Color</Label>
                <div className="mt-[0.5rem] w-[300px] rounded-lg bg-slate-900 dark:bg-slate-700 dark:bg-transparent dark:ring-1 dark:ring-slate-200">
                  <Controller
                    control={control}
                    name="color"
                    rules={{
                      required: "Please select a color",
                    }}
                    render={({ field: { onChange, value } }) => (
                      <>
                        <div className="flex flex-wrap p-[12px]">
                          {presetColors.map(([colorName, hex]) => (
                            <button
                              key={colorName}
                              type="button"
                              className={cn(
                                "m-[4px] h-[24px] w-[24px] cursor-pointer rounded-md p-0 outline-none",
                                colorName === value && "ring-2 ring-slate-50",
                              )}
                              style={{ background: hex }}
                              onClick={() => onChange(colorName)}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  />
                </div>
                {errors.color && (
                  <p className="text-red-600 dark:text-red-500">
                    {errors.color.message}
                  </p>
                )}
              </Field>
            </FieldGroup>
          </Fieldset>
        </DialogBody>
        <DialogActions>
          <Button plain onClick={() => setOpenAddTagDialog(false)}>
            Cancel
          </Button>
          <Button
            color="green"
            type="submit"
            disabled={useCreateTagMutation.isPending}
          >
            Add
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
