"use client";
import { Button } from "@/components/Button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const CTA = () => {
  const router = useRouter();
  const [guestId, setGuestId] = useState<string | null>(null);

  useEffect(() => {
    let id = localStorage.getItem("guestId");
    if (!id) {
      id = "guest-" + crypto.randomUUID();
      localStorage.setItem("guestId", id);
    }
    setGuestId(id);
  }, []);

  return (
    <section className="py-24 px-6">
      <div className="container max-w-4xl mx-auto text-center">
        <div className="relative p-16 rounded-3xl bg-gray-800 overflow-hidden text-white">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-secondary/20 blur-3xl" />

          <div className="relative">
            <span className="font-handwritten text-3xl text-primary-foreground/70">
              Ready to create?
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mt-2 text-background">
              Start sketching in seconds
            </h2>
            <p className="mt-4 text-lg text-background/70 max-w-xl mx-auto">
              Jump right in — no sign-up needed. Your canvas is waiting.
            </p>
            <div className="mt-8">
              <Button
                onClick={() => router.push(`/canvas/${guestId}`)}
                size="lg"
                className="bg-background text-foreground hover:bg-background/90 text-base px-8 py-6 rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-0.5"
              >
                Open Sketchflow
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
