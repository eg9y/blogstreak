"use client";

import { EditorContent, EditorOptions, useEditor } from "@tiptap/react";
import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { UseMutationResult } from "@tanstack/react-query";
import Scrollbar from "react-scrollbars-custom";

import { Button } from "@/app/components/button";
import { extensions } from "@/utils/textEditor";
import { useGetBlogQuery } from "@/utils/hooks/query/use-get-blog";
import { useUser } from "@/utils/getUser";

import { Field, FieldGroup, Fieldset } from "../../fieldset";
import { Input } from "../../input";
import { Toolbar } from "../toolbar";
import { IsPublicSwitch } from "../is-public-switch";

const editorOptions: Partial<EditorOptions> = {
  editorProps: {
    attributes: {
      class:
        "prose prose-base grow break-words xl:prose-lg dark:prose-invert focus:outline-none  prose-p:leading-normal mx-auto",
    },
    handlePaste: (view, event, slice) => {
      const pastedContent = event.clipboardData?.getData("text/plain");
      if (
        pastedContent &&
        pastedContent.match(/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i)
      ) {
        view.dispatch(
          view.state.tr.replaceSelectionWith(
            view.state.schema.nodes.image.create({ src: pastedContent }),
          ),
        );
        return true;
      }
      return false;
    },
  },
  editable: false,
};

export const BlogTextForm = ({
  blogId,
  mutation,
}: {
  blogId?: number;
  mutation: UseMutationResult<void, Error, any, unknown>;
}) => {
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  const { loggedInUser } = useUser();

  const editorContainerRef = useRef(null);

  const { data: blogData, isLoading } = useGetBlogQuery(
    blogId,
    loggedInUser || undefined,
  );
  const editor = useEditor({ extensions, ...editorOptions });
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
      if (editor) {
        editor.setEditable(true);
      }
      return;
    }

    reset({
      title: blogData.data.title,
    });
    setIsPublic(blogData.data.is_public);
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
    const rawText = editor?.getText() || "";
    const payload: {
      blogId?: number;
      title: string;
      content: string;
      rawText: string;
      isPublic: boolean;
    } = { title, content, rawText, isPublic };

    if (blogId) {
      payload.blogId = blogId;
    }

    mutation.mutate(payload, {
      onSuccess: () => {
        toast.success("Your blog has been saved!", {
          position: "top-center",
        });
        setLoadingEdit(false);
      },
      onError: () => {
        toast.error("Error saving your blog", { position: "top-center" });
        setLoadingEdit(false);
      },
    });
  };
  return (
    <div className="flex grow flex-col gap-2">
      <Fieldset>
        <FieldGroup>
          <Field>
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
        </FieldGroup>
      </Fieldset>
      <div className="flex w-full grow flex-col border border-x-0 border-b-0 border-slate-300 bg-white p-2 dark:border-slate-700 dark:bg-transparent md:gap-4 md:rounded-md md:border-x md:border-b ">
        <Toolbar editor={editor} />
        <div
          className="grow cursor-text"
          ref={editorContainerRef}
          // Make the div focusable
          tabIndex={0}
        >
          <Scrollbar
            className=""
            height="100%"
            // Make the div focusable
          >
            <EditorContent editor={editor} />
          </Scrollbar>
        </div>
      </div>
      <div className="flex justify-between bg-[hsl(0_0%_100%)] p-4 dark:bg-[hsl(240_10%_3.9%)]">
        <IsPublicSwitch isPublic={isPublic} setIsPublic={setIsPublic} />
        <Button
          color="orange"
          className="w-40 cursor-pointer self-end"
          onClick={handleSubmit(onSubmit)}
          disabled={loadingEdit}
        >
          Save
        </Button>
      </div>
    </div>
  );
};
