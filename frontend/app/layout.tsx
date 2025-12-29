import "./globals.css";
import type { Metadata } from "next";
import Script from "next/script"; // <--- Import Script
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "GDGoC Newsletter",
  description: "Newsletter from GDGoC Galgotias University",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Lora:ital,wght@0,400;0,600;1,400&family=Manufacturing+Consent&family=New+Rocker&family=UnifrakturCook:wght@700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning className="flex flex-col min-h-screen">
        <AuthProvider>
          <Header />
          <PageTransition>
            <div className="flex-1">{children}</div>
          </PageTransition>
          <Footer />
        </AuthProvider>

        <Toaster position="top-center" richColors />

        {/* EASTER EGG SCRIPT */}
        <Script id="console-easter-egg" strategy="lazyOnload">
          {`
            console.log(
              "%c HEY DEVELOPER! 🛠️",
              "color: #F5E6D0; background: #4A148C; font-size: 24px; padding: 10px; border-radius: 5px; font-weight: bold; border: 2px solid #2c2c2c;"
            );
            console.log(
              \`%c
      /\\_/\\
     ( o.o )   <-- Looking for bugs?
      > ^ <
   
     "Yeh code mast hai,
      chhed-khaani mat karna!"
   
     (Babu Bhaiya is watching...)
              \`,
              "font-family: monospace; color: #4A148C; font-size: 14px; font-weight: bold;"
            );
          `}
        </Script>
      </body>
    </html>
  );
}