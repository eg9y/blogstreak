import Link from "@tiptap/extension-link";
import Color from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import StarterKit from "@tiptap/starter-kit";

export const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle.configure({}),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
      keepAttributes: false,
      HTMLAttributes: {
        class: "",
      },
    },
    orderedList: {
      keepMarks: true,
      // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
      keepAttributes: false,
      HTMLAttributes: {
        class: "",
      },
    },
  }),
  Link.configure({
    // HTMLAttributes: {
    //   class: "text-slate-500",
    // },
    openOnClick: false,
    autolink: true,
  }),
];
