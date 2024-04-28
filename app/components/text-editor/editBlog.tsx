"use client";

import { EditorContent, EditorOptions, useEditor } from "@tiptap/react";
import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Sticky from "react-sticky-el";

import { Button } from "@/app/components/button";
import { extensions } from "@/utils/textEditor";
import { useGetBlogQuery } from "@/utils/hooks/query/use-get-blog";
import { useEditBlog } from "@/utils/hooks/mutation/use-edit-blog";

import { Field, FieldGroup, Fieldset, Label } from "../fieldset";
import { Input } from "../input";

import { Toolbar } from "./toolbar";
import { IsPublicSwitch } from "./is-public-switch";

const editorOptions: Partial<EditorOptions> = {
  editorProps: {
    attributes: {
      class:
        "prose prose-base grow break-words md:prose-lg dark:prose-invert focus:outline-none  prose-p:leading-normal",
    },
  },
  editable: false,
};

export const EditBlogTextEditorComponent = ({ blogId }: { blogId: number }) => {
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [isPublished, setIsPublished] = useState(true);

  const editorContainerRef = useRef(null);

  const { data: blogData, isLoading } = useGetBlogQuery(blogId);
  const editor = useEditor({ extensions, ...editorOptions });
  const editBlogMutation = useEditBlog();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
    },
  });
  useEffect(() => {
    if (!blogData?.data?.text || !editor) {
      return;
    }
    reset({
      title: blogData.data.title,
    });
    setIsPublished(blogData.data.is_published);
    editor.commands.setContent(JSON.parse(blogData.data.text));
    editor.setEditable(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blogData, editor]);

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
    // Dependency array to re-run effect if the editor instance changes
  }, [editor]);

  const onSubmit = ({ title }: { title: string }) => {
    setLoadingEdit(true);
    const content = JSON.stringify(editor?.getJSON());
    editBlogMutation.mutate(
      { title, blogId, content, isPublished },
      {
        onSuccess: () => {
          toast.success("Your post has been edited!", {
            position: "top-center",
          });
          setLoadingEdit(false);
        },
        onError: () => {
          toast.error("Error editing your post", { position: "top-center" });
          setLoadingEdit(false);
        },
      },
    );
  };
  return (
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
                <Input onChange={onChange} value={value} disabled={isLoading} />
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
          </Field>
        </FieldGroup>
      </Fieldset>
      <div className="w-full rounded-md bg-white p-2 ring-1 ring-slate-300 dark:bg-transparent dark:ring-slate-700 ">
        <Toolbar editor={editor} />
        <div
          className="h-full cursor-text"
          ref={editorContainerRef}
          // Make the div focusable
          tabIndex={0}
        >
          <EditorContent editor={editor} />
        </div>
        <Sticky mode="bottom" stickyClassName="z-[100]">
          <div className="flex justify-between bg-[hsl(0_0%_100%)] p-4 dark:bg-[hsl(240_10%_3.9%)]">
            <IsPublicSwitch
              isPublic={isPublished}
              setIsPublic={setIsPublished}
            />
            <Button
              color="orange"
              className="w-40 cursor-pointer self-end"
              onClick={handleSubmit(onSubmit)}
              disabled={loadingEdit}
            >
              Submit Edit
            </Button>
          </div>
        </Sticky>
      </div>
    </div>
  );
};
