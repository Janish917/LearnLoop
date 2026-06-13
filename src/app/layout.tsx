import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/providers/smooth-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "LearnLoop AI - Futuristic Adaptive Learning Platform",
  description:
    "Leverage advanced neural loop agents to accelerate knowledge acquisition, optimize training loops, and scale human intelligence.",
  keywords: [
    "LearnLoop AI",
    "Artificial Intelligence",
    "Machine Learning",
    "Adaptive Learning",
    "Neural Loops",
    "Agentic Workflow",
    "Future Tech",
  ],
  openGraph: {
    title: "LearnLoop AI - Futuristic Adaptive Learning Platform",
    description:
      "Leverage advanced neural loop agents to accelerate knowledge acquisition, optimize training loops, and scale human intelligence.",
    type: "website",
    locale: "en_US",
    siteName: "LearnLoop AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "LearnLoop AI - Futuristic Adaptive Learning Platform",
    description:
      "Leverage advanced neural loop agents to accelerate knowledge acquisition, optimize training loops, and scale human intelligence.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#050816] text-[#F8FAFC]">
        <SmoothScrollProvider>
          <Navbar />
          <main className="flex-grow pt-[73px] md:pt-[88px] flex flex-col relative">
            {children}
          </main>
          <Footer />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
