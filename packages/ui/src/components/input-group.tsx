"use client";

import { Button } from "@website/ui/components/button";
import { Input } from "@website/ui/components/input";
import { Textarea } from "@website/ui/components/textarea";
import { cn } from "@website/ui/lib/utils";
import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import * as React from "react";

const InputGroup = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    data-slot="input-group"
    className={cn(
      "group/input-group border-input has-disabled:bg-input/50 has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:ring-ring/50 has-[[data-slot][aria-invalid=true]]:border-destructive has-[[data-slot][aria-invalid=true]]:ring-destructive/20 dark:bg-input/30 dark:has-disabled:bg-input/80 dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40 relative flex h-8 w-full min-w-0 items-center rounded-lg border transition-colors outline-none in-data-[slot=combobox-content]:focus-within:border-inherit in-data-[slot=combobox-content]:focus-within:ring-0 has-disabled:opacity-50 has-[[data-slot=input-group-control]:focus-visible]:ring-1 has-[[data-slot][aria-invalid=true]]:ring-1 has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>textarea]:h-auto has-[>[data-align=block-end]]:[&>input]:pt-3 has-[>[data-align=block-start]]:[&>input]:pb-3 has-[>[data-align=inline-end]]:[&>input]:pr-1.5 has-[>[data-align=inline-start]]:[&>input]:pl-1.5",
      className
    )}
    {...props}
  />
);

const inputGroupAddonVariants = cva(
  "text-muted-foreground flex h-auto cursor-text items-center justify-center gap-2 py-1.5 text-xs font-medium select-none group-data-[disabled=true]/input-group:opacity-50 [&>kbd]:rounded-md [&>svg:not([class*='size-'])]:size-4",
  {
    variants: {
      align: {
        "inline-start":
          "order-first pl-2 has-[>button]:ml-[-0.3rem] has-[>kbd]:ml-[-0.15rem]",
        "inline-end":
          "order-last pr-2 has-[>button]:mr-[-0.3rem] has-[>kbd]:mr-[-0.15rem]",
        "block-start":
          "order-first w-full justify-start px-2.5 pt-2 group-has-[>input]/input-group:pt-2 [.border-b]:pb-2",
        "block-end":
          "order-last w-full justify-start px-2.5 pb-2 group-has-[>input]/input-group:pb-2 [.border-t]:pt-2",
      },
    },
    defaultVariants: {
      align: "inline-start",
    },
  }
);

const InputGroupAddon = ({
  className,
  align = "inline-start",
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof inputGroupAddonVariants>) => (
  <button
    type="button"
    data-slot="input-group-addon"
    data-align={align}
    className={cn(inputGroupAddonVariants({ align }), className)}
    onClick={(e) => {
      if (
        e.target instanceof HTMLElement &&
        e.target.closest("button") !== e.currentTarget
      ) {
        return;
      }
      e.currentTarget.parentElement?.querySelector("input")?.focus();
    }}
    {...props}
  />
);

const inputGroupButtonVariants = cva(
  "flex items-center gap-2 text-xs shadow-none",
  {
    variants: {
      size: {
        xs: "h-6 gap-1 rounded-md px-1.5 [&>svg:not([class*='size-'])]:size-3.5",
        sm: "gap-1",
        "icon-xs": "size-6 rounded-md p-0 has-[>svg]:p-0",
        "icon-sm": "size-7 p-0 has-[>svg]:p-0",
      },
    },
    defaultVariants: {
      size: "xs",
    },
  }
);

const InputGroupButton = ({
  className,
  type = "button",
  variant = "ghost",
  size = "xs",
  ...props
}: Omit<React.ComponentProps<typeof Button>, "size" | "type"> &
  VariantProps<typeof inputGroupButtonVariants> & {
    type?: "button" | "submit" | "reset";
  }) => (
  <Button
    type={type}
    data-size={size}
    variant={variant}
    className={cn(inputGroupButtonVariants({ size }), className)}
    {...props}
  />
);

const InputGroupText = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    className={cn(
      "text-muted-foreground flex items-center gap-2 text-xs [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
      className
    )}
    {...props}
  />
);

const InputGroupInput = ({
  className,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  ...props
}: React.ComponentProps<"input">) => (
  <Input
    data-slot="input-group-control"
    aria-label={ariaLabel}
    aria-labelledby={ariaLabelledBy}
    className={cn(
      "flex-1 rounded-lg border-0 bg-transparent shadow-none ring-0 focus-visible:ring-0 disabled:bg-transparent aria-invalid:ring-0 dark:bg-transparent dark:disabled:bg-transparent",
      className
    )}
    {...props}
  />
);

const InputGroupTextarea = ({
  className,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  ...props
}: React.ComponentProps<"textarea">) => (
  <Textarea
    data-slot="input-group-control"
    aria-label={ariaLabel}
    aria-labelledby={ariaLabelledBy}
    className={cn(
      "flex-1 resize-none rounded-lg border-0 bg-transparent py-2 shadow-none ring-0 focus-visible:ring-0 disabled:bg-transparent aria-invalid:ring-0 dark:bg-transparent dark:disabled:bg-transparent",
      className
    )}
    {...props}
  />
);

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
};
