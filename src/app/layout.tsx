import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Newsreader } from "next/font/google";
import "./globals.css";
import TopNav from "@/components/TopNav";
import { SpaProvider } from "@/context/SpaContext";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Elexoir Spa App",
  description: "Luxury in-villa mobile spa experience.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#F5F5F7",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Prevents zooming to feel like a native app
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased scroll-smooth">
      <body
        className={`${jakarta.variable} ${newsreader.variable} font-sans bg-background text-text min-h-screen selection:bg-primary selection:text-white pb-20`}
      >
        <SpaProvider>
          {/* Global Apple-Style Glass Ambient Background */}
          <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden bg-[#F5F5F7]">
              <div className="absolute top-[-10%] left-[-10%] w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] rounded-full bg-[#E2E8F0] blur-[80px] md:blur-[120px]"></div>
              <div className="absolute bottom-[-20%] right-[-10%] w-[90vw] h-[90vw] md:w-[50vw] md:h-[50vw] rounded-full bg-[#FCE7F3] blur-[90px] md:blur-[140px]"></div>
              <div className="absolute top-[30%] left-[20%] w-[70vw] h-[70vw] md:w-[40vw] md:h-[40vw] rounded-full bg-[#E0F2FE] blur-[80px] md:blur-[120px]"></div>
              <div className="absolute inset-0 bg-white/60"></div>
          </div>
          <TopNav />
          <main className="w-full relative min-h-[100dvh] bg-transparent overflow-x-hidden">
              {children}
          </main>
        </SpaProvider>
      </body>
    </html>
  );
}
