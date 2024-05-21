import React, { useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { EditorContent, useEditor } from "@tiptap/react";
import { toast } from "sonner";

import { Button } from "../button";
import { Input } from "../input";
import { Field, FieldGroup, Fieldset, Label } from "../fieldset";
import { BadgeButton } from "../badge";

import { Toolbar } from "./toolbar";
import { AddTagDialog } from "./dialog/add-tag-dialog";
import { IsPublicSwitch } from "./is-public-switch";

interface DefaultValues {
  title?: string;
  content: string;
}

interface TextEditorFormProps {
  // eslint-disable-next-line no-unused-vars
  onSubmit: (data: Record<any, any>) => Promise<void>;
  defaultValues: DefaultValues;
  submitLabel: string;
  includeTitle?: boolean;
  includeTags?: boolean;
  includePublicSwitch?: boolean;
}

const TextEditorForm: React.FC<TextEditorFormProps> = ({
  onSubmit,
  defaultValues,
  submitLabel,
  includeTitle = true,
  includeTags = true,
  includePublicSwitch = true,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<DefaultValues>({ defaultValues });
  const [loading, setLoading] = useState(false);
  const [openAddTagDialog, setOpenAddTagDialog] = useState(false);
  const [isPublic, setIsPublic] = useState(false);

  const editor = useEditor({
    content: defaultValues.content || "",
  });

  const submitHandler: SubmitHandler<DefaultValues> = async (data) => {
    setLoading(true);
    try {
      const content = JSON.stringify(editor?.getJSON());
      const rawText = editor?.getText() || "";
      await onSubmit({ ...data, content, rawText, isPublic });
      toast.success("Your post has been created!", { position: "top-center" });
    } catch (error) {
      toast.error("Error creating your post", { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <div className="flex flex-col gap-2">
        <Fieldset>
          <FieldGroup>
            {includeTitle && (
              <Field>
                <Label>Title</Label>
                <Controller
                  name="title"
                  control={control}
                  rules={{
                    required: "Title is required",
                    minLength: {
                      value: 5,
                      message: "Title must be at least 5 characters long",
                    },
                  }}
                  render={({ field: { onChange, value } }) => (
                    <Input onChange={onChange} value={value} />
                  )}
                />
                {errors.title && (
                  <p className="font-semibold text-red-500 dark:text-red-200">
                    {errors.title.message}
                  </p>
                )}
              </Field>
            )}

            <Field>
              <Label>Body</Label>
              <div className="w-full rounded-md bg-white p-2 ring-1 ring-slate-300 dark:bg-transparent dark:ring-slate-700">
                <Toolbar editor={editor} />
                <EditorContent editor={editor} />
              </div>
            </Field>
          </FieldGroup>
        </Fieldset>

        <div className="flex items-center justify-between">
          <div className="flex gap-4">
            {includeTags && (
              <div className="flex gap-1">
                <BadgeButton
                  className="cursor-pointer"
                  color="green"
                  onClick={() => setOpenAddTagDialog(true)}
                >
                  New Tag
                </BadgeButton>
              </div>
            )}
            {includePublicSwitch && (
              <IsPublicSwitch isPublic={isPublic} setIsPublic={setIsPublic} />
            )}
          </div>
          <Button
            color="orange"
            className="w-40 cursor-pointer self-end"
            type="submit"
            disabled={loading}
          >
            {submitLabel}
          </Button>
        </div>
      </div>

      <AddTagDialog
        openAddTagDialog={openAddTagDialog}
        setOpenAddTagDialog={setOpenAddTagDialog}
      />
    </form>
  );
};

export default TextEditorForm;
