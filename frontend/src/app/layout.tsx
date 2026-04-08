import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JobSeeker AI - Your Smart Job Search Assistant",
  description: "AI-powered platform for job search, resume optimization, and interview preparation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}>
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <footer className="bg-gray-800 text-white py-8 mt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="font-bold mb-4">JobSeeker AI</h3>
                  <p className="text-gray-400">Your intelligent companion for career growth</p>
                </div>
                <div>
                  <h4 className="font-bold mb-2">Quick Links</h4>
                  <ul className="text-gray-400 space-y-1">
                    <li><a href="/dashboard" className="hover:text-white">Dashboard</a></li>
                    <li><a href="/resume" className="hover:text-white">Resume</a></li>
                    <li><a href="/interview-prep" className="hover:text-white">Interview Prep</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold mb-2">Support</h4>
                  <ul className="text-gray-400 space-y-1">
                    <li><a href="#" className="hover:text-white">Help Center</a></li>
                    <li><a href="#" className="hover:text-white">Contact Us</a></li>
                    <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
                <p>&copy; 2024 JobSeeker AI. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
