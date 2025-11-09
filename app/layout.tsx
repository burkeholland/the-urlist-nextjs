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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body>
        <AuthProvider>
          <ThemeProvider>
            <NavBar />
            <div className="page">
              {children}
            </div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
