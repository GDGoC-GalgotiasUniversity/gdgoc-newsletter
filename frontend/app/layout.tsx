import "./globals.css";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";

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
        <Header />
        <PageTransition>
          <div className="flex-1">{children}</div>
        </PageTransition>
        <Footer />
      </body>
    </html>
  );
}
