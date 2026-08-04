import { Loading03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "@website/ui/lib/utils";

const Spinner = function Spinner({
  className,
  ...props
}: React.ComponentProps<"svg">) {
  return (
    <HugeiconsIcon
      icon={Loading03Icon}
      {...props}
      strokeWidth={2}
      data-slot="spinner"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
    />
  );
};

export { Spinner };
