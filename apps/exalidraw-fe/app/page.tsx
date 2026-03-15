'use client'

import { useState,useEffect } from "react";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
   const [guestId, setGuestId] = useState<string | null>(null);

  useEffect(() => {
    let id = localStorage.getItem("guestId");
    if (!id) {
      id = "guest-" + crypto.randomUUID();
      localStorage.setItem("guestId", id);
    }
    setGuestId(id);
    console.log(id);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <div id="features">
        <Features />
      </div>
      <CTA />
      <Footer />
    </div>
  );
}
