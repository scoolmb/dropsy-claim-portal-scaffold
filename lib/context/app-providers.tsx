"use client";
import React from "react";
//import { ThemeProvider } from "./theme-provider";
import { SolanaProvider } from "./solana-provider";
import { ClientProviders } from "./query-provider";
//import Header from "../global/Header";
import { Toaster } from "sonner";
import Header from "@/component/Header";
import { ThemeProvider } from "./theme-provider";
import { AirdropProvider } from "./airdrop-data-provider";

export function AppProviders({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClientProviders>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <SolanaProvider>
          <AirdropProvider>
            <div className="min-h-screen flex flex-col">
              <Toaster />
              <Header />

              <main className="flex-1 pt-16">
                <div className="absolute h-full inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)] bg-[size:20px_20px] pointer-events-none" />
                {children}
              </main>
            </div>
          </AirdropProvider>
        </SolanaProvider>
      </ThemeProvider>
    </ClientProviders>
  );
}
