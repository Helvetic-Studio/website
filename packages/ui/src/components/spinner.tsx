import { Loading03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "@website/ui/lib/utils";

const Spinner = ({
  className,
  "aria-label": ariaLabel = "Loading",
  ...props
}: React.ComponentProps<"svg">) => (
  <output aria-label={ariaLabel}>
    <HugeiconsIcon
      icon={Loading03Icon}
      {...props}
      strokeWidth={2}
      data-slot="spinner"
      aria-hidden="true"
      className={cn("size-4 animate-spin", className)}
    />
  </output>
);

export { Spinner };
