import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "../index.css";
import { Providers } from "@/app/providers";
import { ThemeProvider } from "@/components/theme/theme-provider";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Helvetic Studio",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
};

const RootLayout = ({ children }: LayoutProps<"/">) => (
  <html lang="en" suppressHydrationWarning>
    <body
      className={`${geistSans.variable} ${geistMono.variable} antialiased sm:min-h-dvh`}
    >
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <Providers>{children}</Providers>
      </ThemeProvider>
    </body>
  </html>
);

export default RootLayout;
