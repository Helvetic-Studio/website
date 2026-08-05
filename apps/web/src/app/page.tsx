import { ThemeSwitcher } from "@/components/theme-switcher";

export default function Page() {
  return (
    <div className="flex flex-col gap-2 h-screen w-screen items-center justify-center">
      <h1 className="text-4xl font-bold">Hello, World!</h1>
      <ThemeSwitcher />
    </div>
  );
}
