import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cookies } from 'next/headers';
import { verifyJWT } from "@/lib/verifyJwt";
import { Navbar } from "@/components";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Stitch — AI UI Design Tool",
  description:
    "Design anything. Just describe it. AI-powered UI generation from natural language, powered by Claude AI.",
  keywords: ["AI", "UI design", "design tool", "generative AI", "Claude"],
  openGraph: {
    title: "Stitch — AI UI Design Tool",
    description: "AI-powered UI generation from natural language",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  let user = null;

  try {
    user = token ? verifyJWT(token as string) : null;
  } catch {
    user = null;
  }

  // console.log("user", user);
  // if (user == null) {

  // }


  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-[#ededed]">
        <Navbar user={user} />
        {children}
      </body>
    </html>
  );
}
