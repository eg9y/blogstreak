import { Dispatch } from "react";

import { Dialog, DialogActions, DialogBody, DialogTitle } from "../dialog";
import { Description, Field, Label } from "../fieldset";
import { Input } from "../input";
import { Button } from "../button";

export const CreateFolderDialog = ({
  isOpenCreateFolder,
  setIsOpenCreateFolder,
  setFolderName,
  createFolder,
}: {
  isOpenCreateFolder: boolean;
  setIsOpenCreateFolder: Dispatch<boolean>;
  setFolderName: Dispatch<string>;
  createFolder: () => void;
}) => {
  return (
    <Dialog
      open={isOpenCreateFolder}
      onClose={setIsOpenCreateFolder}
      className="z-[52]"
    >
      <DialogTitle>New Folder</DialogTitle>
      <DialogBody>
        <Field>
          <Label>Name</Label>
          <Input
            onChange={(event) => setFolderName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                createFolder();
              }
            }}
          />
          <Description>You can leave blank</Description>
        </Field>
      </DialogBody>
      <DialogActions>
        <Button plain onClick={() => setIsOpenCreateFolder(false)}>
          Cancel
        </Button>
        <Button
          color="green"
          onClick={() => {
            createFolder();
          }}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};
