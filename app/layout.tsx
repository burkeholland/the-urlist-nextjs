import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import { ThemeProvider } from "@/components/ThemeContext";
import NavBar from "@/components/NavBar";

export const metadata: Metadata = {
  title: "The URList",
  description: "The URList website as a Next.js project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ThemeProvider>
            <NavBar />
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
