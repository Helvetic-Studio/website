import { buttonVariants } from "@website/ui/components/button";
import { cn } from "@website/ui/lib/utils";
import Link from "next/link";

const NotFoundPage = () => (
  <div className="flex h-dvh w-full max-w-full flex-col items-center justify-center gap-4 px-4 sm:px-6">
    <h1 className="text-4xl font-bold">Page not found</h1>
    <p className="text-center text-muted-foreground">
      The page you are looking for does not exist.
    </p>
    <Link href="/" className={cn(buttonVariants({ variant: "secondary" }))}>
      Back to home
    </Link>
  </div>
);

export default NotFoundPage;
