import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  MoreHorizontalCircle01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@website/ui/components/button";
import { cn } from "@website/ui/lib/utils";
import * as React from "react";

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    data-slot="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
);

const PaginationContent = ({
  className,
  ...props
}: React.ComponentProps<"ul">) => (
  <ul
    data-slot="pagination-content"
    className={cn("flex items-center gap-0.5", className)}
    {...props}
  />
);

const PaginationItem = ({ ...props }: React.ComponentProps<"li">) => (
  <li data-slot="pagination-item" {...props} />
);

export type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<React.ComponentProps<typeof Button>, "size"> &
  React.ComponentProps<"a">;

const PaginationLink = ({
  className,
  isActive,
  size = "icon",
  children,
  ...props
}: PaginationLinkProps) => {
  const active = isActive === true;

  return (
    <Button
      variant={active ? "outline" : "ghost"}
      size={size}
      className={cn(className)}
      nativeButton={false}
      render={
        <a
          aria-current={active ? "page" : undefined}
          data-slot="pagination-link"
          data-active={active}
          {...props}
        >
          {children}
        </a>
      }
    />
  );
};

const PaginationPrevious = ({
  className,
  text = "Previous",
  ...props
}: React.ComponentProps<typeof PaginationLink> & { text?: string }) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={cn("pl-1.5!", className)}
    {...props}
  >
    <HugeiconsIcon
      icon={ArrowLeft01Icon}
      strokeWidth={2}
      data-icon="inline-start"
    />
    <span className="hidden sm:block">{text}</span>
  </PaginationLink>
);

const PaginationNext = ({
  className,
  text = "Next",
  ...props
}: React.ComponentProps<typeof PaginationLink> & { text?: string }) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={cn("pr-1.5!", className)}
    {...props}
  >
    <span className="hidden sm:block">{text}</span>
    <HugeiconsIcon
      icon={ArrowRight01Icon}
      strokeWidth={2}
      data-icon="inline-end"
    />
  </PaginationLink>
);

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    aria-hidden
    data-slot="pagination-ellipsis"
    className={cn(
      "flex size-8 items-center justify-center [&_svg:not([class*='size-'])]:size-4",
      className
    )}
    {...props}
  >
    <HugeiconsIcon icon={MoreHorizontalCircle01Icon} strokeWidth={2} />
    <span className="sr-only">More pages</span>
  </span>
);

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
