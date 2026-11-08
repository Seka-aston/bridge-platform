"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";

// Password field with a show/hide toggle.
export function PasswordInput({ showLabel, hideLabel, className, ...props }: React.ComponentProps<typeof InputGroupInput> & { showLabel: string; hideLabel: string }) {
  const [shown, setShown] = useState(false);
  return (
    <InputGroup className={className}>
      <InputGroupInput type={shown ? "text" : "password"} {...props} />
      <InputGroupAddon align="inline-end">
        <InputGroupButton size="icon-xs" aria-label={shown ? hideLabel : showLabel} aria-pressed={shown} onClick={() => setShown((s) => !s)}>
          {shown ? <EyeOff /> : <Eye />}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
}
