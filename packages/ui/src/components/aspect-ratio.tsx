import { cn } from "@website/ui/lib/utils";

interface AspectRatioStyle extends React.CSSProperties {
  "--ratio": number;
}

const AspectRatio = function AspectRatio({
  ratio,
  className,
  ...props
}: React.ComponentProps<"div"> & { ratio: number }) {
  const style: AspectRatioStyle = { "--ratio": ratio };

  return (
    <div
      data-slot="aspect-ratio"
      style={style}
      className={cn("relative aspect-(--ratio)", className)}
      {...props}
    />
  );
};

export { AspectRatio };
