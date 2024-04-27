"use client";

import { EditorContent, EditorOptions, useEditor } from "@tiptap/react";
import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";
import { Scrollbar } from "react-scrollbars-custom";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/app/components/button";
import { extensions } from "@/utils/textEditor";
import { useCreateBlog } from "@/utils/hooks/mutation/use-create-blog";

import { Field, FieldGroup, Fieldset, Label } from "../fieldset";
import { Input } from "../input";

import { IsPublicSwitch } from "./is-public-switch";
import { Toolbar } from "./toolbar";

const editorOptions: Partial<EditorOptions> = {
  editorProps: {
    attributes: {
      class:
        "prose dark:prose-invert prose-sm m-5 focus:outline-none max-w-full",
    },
  },
  editable: true,
};

export const CreateBlogEditor = () => {
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [isPublished, setIsPublished] = useState(true);
  const submitBlogMutation = useCreateBlog();
  const editorContainerRef = useRef(null);
  const editor = useEditor({ extensions, content: "", ...editorOptions });
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
    },
  });

  useEffect(() => {
    // Step 3: Add an event listener to focus the editor
    const handleFocus = () => {
      if (editor && editor.isEditable) {
        editor.commands.focus();
      }
    };

    const editorContainer = editorContainerRef.current;
    if (editorContainer) {
      (editorContainer as any).addEventListener("focus", handleFocus, true);
    }

    // Cleanup the event listener
    return () => {
      if (editorContainer) {
        (editorContainer as any).removeEventListener(
          "focus",
          handleFocus,
          true,
        );
      }
    };
  }, [editor]);

  function submitPost({ title }: { title: string }) {
    console.log("submitting post");
    setLoadingEdit(true);
    const content = JSON.stringify(editor?.getJSON());
    submitBlogMutation.mutate(
      {
        content,
        title,
        isPublished,
      },
      {
        onSuccess: () => {
          toast.success("Your post has been created!", {
            position: "top-center",
          });
          setLoadingEdit(false);
        },
        onError: () => {
          toast.error("Error creating your post", {
            position: "top-center",
          });
          setLoadingEdit(false);
        },
      },
    );
  }

  return (
    <form>
      <div className="flex flex-col gap-2">
        <Fieldset>
          <FieldGroup>
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
              {errors && (
                <p className="font-semibold text-red-500 dark:text-red-200">
                  {errors.title?.message}
                </p>
              )}
            </Field>

            <Field>
              <Label>Body</Label>
              <div className=" w-full rounded-md bg-white p-2 ring-1 ring-slate-300 dark:ring-slate-700 ">
                <Toolbar editor={editor} />
                <div
                  className="h-full cursor-text"
                  ref={editorContainerRef}
                  // Make the div focusable
                  tabIndex={0}
                >
                  <Scrollbar
                    style={{
                      height: "60vh",
                    }}
                  >
                    <EditorContent editor={editor} />
                  </Scrollbar>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-4">
                    <IsPublicSwitch
                      isPublic={isPublished}
                      setIsPublic={setIsPublished}
                    />
                  </div>
                  <Button
                    color="orange"
                    onClick={handleSubmit(submitPost)}
                    className="w-40 cursor-pointer self-end"
                    disabled={loadingEdit}
                  >
                    Post
                  </Button>
                </div>
              </div>
            </Field>
          </FieldGroup>
        </Fieldset>
      </div>
    </form>
  );
};
