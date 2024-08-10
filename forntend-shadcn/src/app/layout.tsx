import type { Metadata, Viewport } from "next";
import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils"
import { ThirdwebProvider } from "thirdweb/react";

import { AlchemyProvider } from "@/components/AlchemyProvider";
import { config } from "@/lib/config";
import { cookieToInitialState } from "@account-kit/core";
import { headers } from "next/headers";

import "@/styles/globals.css";
import "@/styles/index.css";


const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

const APP_NAME = "PWA App";
const APP_DEFAULT_TITLE = "My Awesome PWA App";
const APP_TITLE_TEMPLATE = "%s - PWA App";
const APP_DESCRIPTION = "Best PWA app in the world!";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const initialState = cookieToInitialState(
    config,
    headers().get("cookie") ?? undefined
  );

  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <main className="dark">
          <AlchemyProvider initialState={initialState}>
            <ThirdwebProvider>{children}</ThirdwebProvider>
          </AlchemyProvider>
        </main>
      </body>
    </html>
  );
}
