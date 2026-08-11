import { Button } from "@website/ui/components/button";

import { ThemeSwitcher } from "@/components/theme/theme-switcher";

const Page = () => (
  <div className="flex h-dvh w-full max-w-full flex-col items-center justify-center gap-4 px-4 sm:px-6">
    <h1 className="text-4xl font-bold">Hello, World!</h1>
    <Button>Click me</Button>
    <ThemeSwitcher />
  </div>
);

export default Page;
