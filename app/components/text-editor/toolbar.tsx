import { Editor } from "@tiptap/react";
import Sticky from "react-sticky-el";
import {
  CodeIcon,
  FontBoldIcon,
  FontItalicIcon,
  ListBulletIcon,
  StrikethroughIcon,
  Link1Icon,
  ImageIcon,
} from "@radix-ui/react-icons";
import Image from "next/image";
import { useCallback, useState } from "react";

import { cn } from "@/utils/utils";

import { Dialog, DialogActions, DialogBody } from "../dialog";
import { Field, Label } from "../fieldset";
import { Input } from "../input";
import { Button } from "../button";

export const Toolbar = ({ editor }: { editor: Editor | null }) => {
  const [isLinkOptionOpen, setIsLinkOptionOpen] = useState(false);
  const [link, setLink] = useState("");
  const [isImageOptionOpen, setIsImageOptionOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const createLink = useCallback(() => {
    if (!editor) {
      return;
    }

    const url = link;

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();

      return;
    }

    // update link
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    setIsLinkOptionOpen(false);
    setLink("");
  }, [editor, link]);

  const insertImage = useCallback(() => {
    if (!editor || !imageUrl) {
      return;
    }
    editor.chain().focus().setImage({ src: imageUrl }).run();
    setIsImageOptionOpen(false);
    setImageUrl("");
  }, [editor, imageUrl]);

  if (!editor) {
    return null;
  }

  return (
    <>
      <Dialog open={isLinkOptionOpen} onClose={setIsLinkOptionOpen}>
        <DialogBody>
          <Field>
            <Label>Link</Label>
            <Input
              name="link"
              value={link}
              onChange={(event) => setLink(event.target.value)}
              placeholder="http://google.com"
            />
          </Field>
        </DialogBody>
        <DialogActions>
          <Button plain onClick={() => setIsLinkOptionOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => createLink()}>Set Link</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={isImageOptionOpen} onClose={setIsImageOptionOpen}>
        <DialogBody>
          <Field>
            <Label>Image URL</Label>
            <Input
              name="imageUrl"
              value={imageUrl}
              onChange={(event) => setImageUrl(event.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </Field>
        </DialogBody>
        <DialogActions>
          <Button plain onClick={() => setIsImageOptionOpen(false)}>
            Cancel
          </Button>
          <Button onClick={insertImage}>Insert Image</Button>
        </DialogActions>
      </Dialog>
      <Sticky stickyClassName="z-[100]">
        <div className="flex w-full flex-wrap gap-1 rounded-md bg-slate-100 p-2 dark:bg-slate-600">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            className={cn(
              "rounded-sm bg-slate-50 p-1 text-xs ring-1 ring-slate-500 dark:bg-slate-400",
              editor.isActive("bold") ? "bg-yellow-200 dark:bg-yellow-500" : "",
            )}
          >
            <FontBoldIcon />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className={cn(
              "rounded-sm bg-slate-50 p-1 text-xs ring-1 ring-slate-500 dark:bg-slate-400",
              editor.isActive("italic")
                ? "bg-yellow-200 dark:bg-yellow-500"
                : "",
            )}
          >
            <FontItalicIcon />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editor.can().chain().focus().toggleStrike().run()}
            className={cn(
              "rounded-sm bg-slate-50 p-1 text-xs ring-1 ring-slate-500 dark:bg-slate-400",
              editor.isActive("strike")
                ? "bg-yellow-200 dark:bg-yellow-500"
                : "",
            )}
          >
            <StrikethroughIcon />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCode().run()}
            disabled={!editor.can().chain().focus().toggleCode().run()}
            className={cn(
              "rounded-sm bg-slate-50 p-1 text-xs ring-1 ring-slate-500 dark:bg-slate-400",
              editor.isActive("code") ? "bg-yellow-200 dark:bg-yellow-500" : "",
            )}
          >
            code
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={cn(
              "rounded-sm bg-slate-50 p-1 text-xs ring-1 ring-slate-500 dark:bg-slate-400",
              editor.isActive("heading", { level: 1 })
                ? "bg-yellow-200 dark:bg-yellow-500"
                : "",
            )}
          >
            h1
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={cn(
              "rounded-sm bg-slate-50 p-1 text-xs ring-1 ring-slate-500 dark:bg-slate-400",
              editor.isActive("heading", { level: 2 })
                ? "bg-yellow-200 dark:bg-yellow-500"
                : "",
            )}
          >
            h2
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            className={cn(
              "rounded-sm bg-slate-50 p-1 text-xs ring-1 ring-slate-500 dark:bg-slate-400",
              editor.isActive("heading", { level: 3 })
                ? "bg-yellow-200 dark:bg-yellow-500"
                : "",
            )}
          >
            h3
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 4 }).run()
            }
            className={cn(
              "rounded-sm bg-slate-50 p-1 text-xs ring-1 ring-slate-500 dark:bg-slate-400",
              editor.isActive("heading", { level: 4 })
                ? "bg-yellow-200 dark:bg-yellow-500"
                : "",
            )}
          >
            h4
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 5 }).run()
            }
            className={cn(
              "rounded-sm bg-slate-50 p-1 text-xs ring-1 ring-slate-500 dark:bg-slate-400",
              editor.isActive("heading", { level: 5 })
                ? "bg-yellow-200 dark:bg-yellow-500"
                : "",
            )}
          >
            h5
          </button>
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 6 }).run()
            }
            className={cn(
              "rounded-sm bg-slate-50 p-1 text-xs ring-1 ring-slate-500 dark:bg-slate-400",
              editor.isActive("heading", { level: 6 })
                ? "bg-yellow-200 dark:bg-yellow-500"
                : "",
            )}
          >
            h6
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={cn(
              "rounded-sm bg-slate-50 p-1 text-xs ring-1 ring-slate-500 dark:bg-slate-400",
              editor.isActive("bulletList")
                ? "bg-yellow-200 dark:bg-yellow-500"
                : "",
            )}
          >
            <ListBulletIcon />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={cn(
              "rounded-sm bg-slate-50 p-1 text-xs ring-1 ring-slate-500 dark:bg-slate-400",
              editor.isActive("orderedList")
                ? "bg-yellow-200 dark:bg-yellow-500"
                : "",
            )}
          >
            1.
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={cn(
              "rounded-sm bg-slate-50 p-1 text-xs ring-1 ring-slate-500 dark:bg-slate-400",
              editor.isActive("codeBlock")
                ? "bg-yellow-200 dark:bg-yellow-500"
                : "",
            )}
          >
            <CodeIcon />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={cn(
              "rounded-sm bg-slate-50 p-1 text-xs ring-1 ring-slate-500 dark:bg-slate-400",
              editor.isActive("blockquote")
                ? "bg-yellow-200 dark:bg-yellow-500"
                : "",
            )}
          >
            blockquote
          </button>
          {editor.isActive("link") && (
            <button
              onClick={() => editor.chain().focus().unsetLink().run()}
              className={cn(
                "rounded-sm bg-yellow-200 p-1 text-xs ring-1  ring-slate-500 dark:bg-yellow-500",
              )}
            >
              <Link1Icon />
            </button>
          )}
          {!editor.isActive("link") && (
            <button
              onClick={() => setIsLinkOptionOpen(true)}
              className={cn(
                "rounded-sm bg-slate-50 p-1 text-xs ring-1  ring-slate-500 dark:bg-slate-400",
              )}
            >
              <Link1Icon />
            </button>
          )}
          <button
            onClick={() => setIsImageOptionOpen(true)}
            className={cn(
              "rounded-sm bg-slate-50 p-1 text-xs ring-1 ring-slate-500 dark:bg-slate-400",
            )}
          >
            <ImageIcon />
          </button>

          <button
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
            className={cn(
              "rounded-sm bg-slate-50 p-1 text-xs ring-1 ring-slate-500 dark:bg-slate-400 md:hidden",
            )}
          >
            <Image
              alt="undo"
              src="/icons/undo-icon.svg"
              width={16}
              height={16}
            />
          </button>
          <button
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
            className={cn(
              "rounded-sm bg-slate-50 p-1 text-xs ring-1 ring-slate-500 dark:bg-slate-400 md:hidden",
            )}
          >
            <Image
              alt="redo"
              src="/icons/redo-icon.svg"
              width={16}
              height={16}
            />
          </button>

          {/* <button
        onClick={() => editor.chain().focus().setColor("#958DF1").run()}
        className={
          editor.isActive("textStyle", { color: "#958DF1" })
            ? "bg-yellow-200 dark:bg-yellow-500"
            : ""
        }
      >
        purple
      </button> */}
        </div>
      </Sticky>
    </>
  );
};
