import "./globals.css";
import type { Metadata } from "next";
import Script from "next/script"; // <--- 1. Import Script for the Easter Egg
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
<<<<<<< HEAD
=======
        {/* Favicon GDG logo */}
        <link rel="icon" type="image/svg+xml" href="./final-gdg-logo.svg" />
>>>>>>> 3a9b743 (fixed cloudinary errors and env errors)
      </head>
      <body suppressHydrationWarning className="flex flex-col min-h-screen">
        <AuthProvider>
          <Header />
          <PageTransition>
            <div className="flex-1">{children}</div>
          </PageTransition>
          <Footer />
        </AuthProvider>

        {/* 3. Add the Toaster component here */}
        <Toaster position="top-center" richColors />

        {/* 4. EASTER EGG: This script runs only in the browser console */}
        <Script id="console-easter-egg" strategy="afterInteractive">
          {`
            console.log(
              "%c HEY DEVELOPER! 🛠️",
              "color: #fff; background: #EA4335; font-size: 24px; padding: 10px; border-radius: 5px; font-weight: bold;"
            );
            console.log(
              \`%c
      /\\_/\\  
     ( o.o ) 
      > ^ <  
    
   Wait... are you looking for bugs?
   
      (\\__/)
      (•ㅅ•)      "Yeh code mast hai,
      / 　 づ        chhed-khaani mat karna!"
              \`,
              "font-family: monospace; color: #4285F4; font-size: 14px; font-weight: bold;"
            );
          `}
        </Script>
      </body>
    </html>
  );
}