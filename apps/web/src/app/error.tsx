"use client";

import { Button } from "@website/ui/components/button";
import { useEffect } from "react";

const ErrorPage = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-dvh w-full max-w-full flex-col items-center justify-center gap-4 px-4 sm:px-6">
      <h1 className="text-4xl font-bold">Something went wrong</h1>
      <p className="text-muted-foreground text-center">
        An unexpected error occurred. You can try again.
      </p>
      <Button type="button" onClick={reset}>
        Try again
      </Button>
    </div>
  );
};

export default ErrorPage;
