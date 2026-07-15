import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ChatWidget from "@/components/chat/ChatWidget";
import LoadingScreen from "@/components/LoadingScreen";

export const metadata: Metadata = {
  title: "Shanthi's Tailoring — Bespoke Luxury Tailoring, Chennai",
  description:
    "India's premier AI-powered tailoring studio. Bespoke bridal wear, designer blouses, and custom fashion. Book your private consultation in Thiruvottiyur, Chennai.",
  keywords: "bespoke tailoring Chennai, bridal blouse stitching, designer blouse Chennai, Aari work embroidery, custom tailoring",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&family=Outfit:wght@200;300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="min-h-screen flex flex-col antialiased"
        style={{ fontFamily: "'Outfit', system-ui, sans-serif", fontWeight: 300 }}
      >
        <LoadingScreen />
        <Navbar />
        <div className="flex-1">
          {children}
        </div>
        <ChatWidget />
        <Footer />
      </body>
    </html>
  );
}
