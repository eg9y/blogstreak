import { HexColorPicker } from "react-colorful";
import { Dispatch, useState } from "react";

import { Badge } from "../../badge";
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from "../../dialog";
import { useGetTopicsQuery } from "@/utils/hooks/query/use-get-tags";
import { getUser } from "@/utils/getUser";
import { Field, Label } from "../../fieldset";
import { Input } from "../../input";
import { Button } from "../../button";

export function AddTagDialog({
  openAddTagDialog,
  setOpenAddTagDialog,
}: {
  openAddTagDialog: boolean;
  setOpenAddTagDialog: Dispatch<boolean>;
}) {
  const [tagColor, setTagColor] = useState("white");

  const { currentUser } = getUser();
  const { data, isLoading, isFetching, isPending, isSuccess } =
    useGetTopicsQuery(currentUser);

  return (
    <Dialog
      open={openAddTagDialog}
      onClose={setOpenAddTagDialog}
      className="z-[52]"
    >
      <DialogTitle>Add Tag</DialogTitle>
      <DialogDescription>
        Tags let&apos;s you keep track of any of your writings that are related
        to each other.
      </DialogDescription>
      <DialogBody className="flex flex-col gap-4">
        <Field>
          <Label>Existing Tags</Label>
          <div className="mt-[0.75rem] flex gap-1">
            {isSuccess && data?.data?.length === 0 && (
              <p className="text-sm text-slate-700">
                No Tags have been created
              </p>
            )}
            {isSuccess &&
              data?.data?.map((topic) => {
                return <Badge color={topic.color as any}>{topic.name}</Badge>;
              })}
          </div>
        </Field>
        <Field>
          <Label>Tag</Label>
          <Input name="tag" />
          {tagColor}
          <HexColorPicker color={tagColor} onChange={setTagColor} />
        </Field>
      </DialogBody>
      <DialogActions>
        <Button plain onClick={() => setOpenAddTagDialog(false)}>
          Cancel
        </Button>
        <Button color="green" onClick={() => {}}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}
