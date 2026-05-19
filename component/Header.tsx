"use client";

import { useState, useEffect } from "react";
import { WalletConnectButton } from "./wallet-connect-button";
import { ModeToggle } from "./mode-toggle";
import { cn } from "@/lib/utils";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
          isScrolled
            ? "bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-lg"
            : "bg-background/60 backdrop-blur-md border-b border-border/30",
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              {/* Network Indicator */}
              <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-linear-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Solana</span>
              </div>

              {/* Wallet Connect */}
              <WalletConnectButton />

              {/* Theme Toggle */}
              <ModeToggle />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
