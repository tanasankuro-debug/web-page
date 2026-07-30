"use client";

import { useId, useState, type ComponentProps } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function FloatingInput({
  label,
  className,
  id: idProp,
  value,
  onFocus,
  onBlur,
  ...props
}: ComponentProps<typeof Input> & { label: string }) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const [focused, setFocused] = useState(false);
  const hasValue = typeof value === "string" ? value.length > 0 : Boolean(value);
  const floated = focused || hasValue;

  return (
    <div className="relative">
      <Input
        id={id}
        value={value}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        placeholder={label}
        className={cn("h-14 rounded-xl pt-4 pb-1 placeholder:text-transparent", className)}
        {...props}
      />
      <label
        htmlFor={id}
        className={cn(
          "pointer-events-none absolute left-3 origin-left text-muted-foreground transition-all duration-150",
          floated ? "top-2 scale-75 text-primary" : "top-1/2 -translate-y-1/2 scale-100",
        )}
      >
        {label}
      </label>
    </div>
  );
}
