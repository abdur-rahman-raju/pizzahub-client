import { Suspense } from "react";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ThemeToggle from "@/components/layout/ThemeToggle";
import { Toaster } from "@/components/ui/sonner";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "PizzaHub | Hot & Fresh Pizza Delivered",
  description:
    "Order hot and fresh pizza from local pizza shops. Browse menus, place orders and track them easily.",
};

const themeScript = `try{var t=localStorage.getItem("theme");if(t==="dark"||(!t&&window.matchMedia("(prefers-color-scheme: dark)").matches)){document.documentElement.classList.add("dark")}}catch(e){}`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${poppins.className} flex min-h-screen flex-col antialiased`}>
        <Suspense fallback={<div className="h-16" />}>
          <Navbar />
        </Suspense>

        <main className="flex-1">
          <Suspense
            fallback={
              <div className="flex min-h-[60vh] items-center justify-center">
                <p>Loading...</p>
              </div>
            }
          >
            {children}
          </Suspense>
        </main>

        <Footer />
        <ThemeToggle />
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}