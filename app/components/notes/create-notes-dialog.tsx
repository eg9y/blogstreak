import { Dispatch } from "react";

import { Dialog, DialogActions, DialogBody, DialogTitle } from "../dialog";
import { Description, Field, Label } from "../fieldset";
import { Input } from "../input";
import { Button } from "../button";

export const CreateNotesDialog = ({
  isOpenCreateNotes,
  setIsOpenCreateNotes,
  setNotesName,
  createNotes,
}: {
  isOpenCreateNotes: boolean;
  setIsOpenCreateNotes: Dispatch<boolean>;
  setNotesName: Dispatch<string>;
  createNotes: () => void;
}) => {
  return (
    <Dialog
      open={isOpenCreateNotes}
      onClose={setIsOpenCreateNotes}
      className="z-[52]"
    >
      <DialogTitle>New Notes</DialogTitle>
      <DialogBody>
        <Field>
          <Label>Name</Label>
          <Input
            onChange={(event) => setNotesName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                createNotes();
              }
            }}
          />
          <Description>You can leave blank</Description>
        </Field>
      </DialogBody>
      <DialogActions>
        <Button plain onClick={() => setIsOpenCreateNotes(false)}>
          Cancel
        </Button>
        <Button
          color="green"
          onClick={() => {
            createNotes();
          }}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};
