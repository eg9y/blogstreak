import { Field as HeadlessField } from "@headlessui/react";
import { Switch } from "../switch";
import { Label } from "../fieldset";
import { SetStateAction } from "react";

export function IsPublicSwitch({
  isPublic,
  setIsPublic,
}: {
  isPublic: boolean;
  setIsPublic: React.Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <HeadlessField className="flex items-center gap-1">
      <Switch
        name="public"
        color="sky"
        checked={isPublic}
        onChange={setIsPublic}
      />
      <Label className="text-sm dark:text-slate-200">Public</Label>
    </HeadlessField>
  );
}
