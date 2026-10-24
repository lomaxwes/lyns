import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lyns — ближе друг к другу",
  description: "Личные переписки в Lyns",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ru"><body>{children}</body></html>;
}
