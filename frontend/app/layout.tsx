import "./globals.css";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
// 1. Import the AuthProvider
import { AuthProvider } from "@/context/AuthContext"; 
// (If "@/" doesn't work for context, try "../context/AuthContext")

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
        {/* 2. Wrap everything inside body with AuthProvider */}
        <AuthProvider>
          <Header />
          <PageTransition>
            <div className="flex-1">{children}</div>
          </PageTransition>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}