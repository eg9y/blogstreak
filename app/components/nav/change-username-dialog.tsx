import { Dispatch } from "react";

import { Button } from "../button";
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from "../dialog";
import { Field, Label } from "../fieldset";
import { Input } from "../input";

export function ChangeUsernameDialog({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<boolean>;
}) {
  return (
    <Dialog open={isOpen} onClose={setIsOpen}>
      <DialogTitle>Refund payment</DialogTitle>
      <DialogDescription>
        The refund will be reflected in the customer’s bank account 2 to 3
        business days after processing.
      </DialogDescription>
      <DialogBody>
        <Field>
          <Label>Amount</Label>
          <Input name="amount" placeholder="$0.00" />
        </Field>
      </DialogBody>
      <DialogActions>
        <Button plain onClick={() => setIsOpen(false)}>
          Cancel
        </Button>
        <Button onClick={() => setIsOpen(false)}>Refund</Button>
      </DialogActions>
    </Dialog>
  );
}
