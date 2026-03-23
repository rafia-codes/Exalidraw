import { Pencil, Users, Zap, Layers, Share2, Lock } from "lucide-react";

const features = [
  {
    icon: Pencil,
    title: "Freehand Drawing",
    description: "Sketch ideas naturally with our intuitive drawing tools. Feels like pen on paper.",
  },
  {
    icon: Users,
    title: "Real-time Collaboration",
    description: "Work together with your team in real-time. See cursors, edits, and changes instantly.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "No lag, no waiting. Your canvas responds instantly to every stroke and shape.",
  },
  {
    icon: Layers,
    title: "Infinite Canvas",
    description: "Never run out of space. Pan, zoom, and organize without limits.",
  },
  {
    icon: Share2,
    title: "Easy Sharing",
    description: "Share a link and collaborate. Be creative.",
  },
  {
    icon: Lock,
    title: "End-to-End Encrypted",
    description: "Your drawings stay private. We can't see your data, and neither can anyone else.",
  },
];

const Features = () => {
  return (
    <section className="py-24 px-6">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="font-handwritten text-3xl text-primary">Why you'll love it</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2 text-foreground">
            Everything you need to sketch ideas
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            A collaborative whiteboard that feels like magic. Simple enough for quick sketches, powerful enough for complex diagrams.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group p-8 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-pink-100 text-orange-700/85 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;