import { Button } from "@/components/Button";
import { ArrowRight } from "lucide-react";
import heroImage from "../public/hero.png";

const Hero = () => {
  return (
    <section className="relative overflow-hidden pt-20 pb-16 px-6">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-secondary/10 blur-3xl" />
      </div>

      <div className="container max-w-6xl mx-auto relative">
        {/* Nav */}
        <nav className="flex items-center justify-between mb-20">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-orange-600 text-white flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary-foreground">
                <path d="M12 19l7-7 3 3-7 7-3-3z" />
                <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                <path d="M2 2l7.586 7.586" />
                <circle cx="11" cy="11" r="2" />
              </svg>
            </div>
            <span className="text-xl font-bold text-foreground">Sketchflow</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Docs</a>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm">Sign in</Button>
            <Button variant="hero" size="sm" className="bg-orange-600/80 text-white">Get Started</Button>
          </div>
        </nav>

        {/* Hero content */}
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-red-500 border border-red-400 mb-8">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            <span className="text-sm font-medium text-primary">Now with real-time collaboration</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground leading-[1.1]">
            Draw, sketch &{" "}
            <span className="text-gradient">collaborate</span>
            <br />
            <span className="font-handwritten text-6xl md:text-8xl font-normal">beautifully</span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            An open-source virtual whiteboard for sketching hand-drawn like diagrams.
            Collaborative and end-to-end encrypted.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <Button variant="hero" size="lg" className="text-base px-8 py-6 rounded-xl bg-orange-600/90 text-white">
              Start Drawing — It's Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button variant="hero-outline" size="lg" className="text-base px-8 py-6 rounded-xl">
              View Demo
            </Button>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            No account required • Free forever for individuals
          </p>
        </div>

        {/* Hero image */}
        <div className="mt-16 relative">
          <div className="hero-glow rounded-2xl">
            <img
              src={heroImage.src}
              alt="Sketchflow canvas showing hand-drawn diagrams and flowcharts"
              className="w-full rounded-2xl border border-border shadow-2xl shadow-foreground/5"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;