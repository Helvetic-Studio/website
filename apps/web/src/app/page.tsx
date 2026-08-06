import { ThemeSwitcher } from "@/components/theme/theme-switcher";

const Page = () => {
  return (
    <div className="flex flex-col gap-4 h-screen w-screen items-center justify-center">
      <h1 className="text-4xl font-bold">Hello, World!</h1>
      <ThemeSwitcher />
    </div>
  );
};

export default Page;
