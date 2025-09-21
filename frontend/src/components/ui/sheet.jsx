import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "../../lib/utils"; // <- changed

export const Sheet = DialogPrimitive.Root;
export const SheetTrigger = DialogPrimitive.Trigger;

export function SheetContent({ className, side = "right", children, ...props }) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/30 data-[state=open]:animate-in data-[state=closed]:animate-out" />
      <DialogPrimitive.Content
        data-state="open"
        className={cn(
          "fixed z-50 bg-background p-6 shadow-md focus:outline-none",
          side === "right" && "right-0 top-0 h-full w-80 animate-slide-in-from-right data-[state=closed]:animate-slide-out-to-right",
          side === "left" && "left-0 top-0 h-full w-80",
          side === "bottom" && "left-0 right-0 bottom-0 h-1/3",
          "border-l",
          className
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}