import type { Metadata } from "next";
import "./globals.css";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-[#050816] text-[#E8F4FD] relative overflow-x-hidden">
        <div className="noise-overlay" />
        {children}
      </body>
    </html>
  );
}
