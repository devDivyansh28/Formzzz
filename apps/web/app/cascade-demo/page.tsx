"use client";

import { useState } from "react";
import {
  ArrowRight,
  BarChart3,
  ChevronRight,
  Droplets,
  Layers3,
  Send,
  Sparkles,
  Waves,
} from "lucide-react";
import { toast } from "sonner";
import { WaveDivider } from "~/components/wave-divider";

const navLinks = [
  { id: "hero", label: "Hero" },
  { id: "cards", label: "Cards" },
  { id: "form", label: "Form" },
];

const cards = [
  {
    title: "Deep Surfaces",
    body: "Layered panels use mist blur, restrained borders, and inset glow to feel submerged without losing clarity.",
    icon: Layers3,
  },
  {
    title: "Flowing Signals",
    body: "Animated cascade panels guide the eye vertically while keeping the page calm and readable.",
    icon: Waves,
  },
  {
    title: "Fresh Feedback",
    body: "Every button emits an expanding ripple from the click point, giving each action a liquid response.",
    icon: BarChart3,
  },
];

export default function CascadeDemo() {
  const [activeLink, setActiveLink] = useState(navLinks[0]?.id ?? "hero");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    window.setTimeout(() => {
      setIsSubmitting(false);
      setEmail("");
      setNote("");
      toast.success("Cascade form flow received.");
    }, 700);
  }

  return (
    <main className="cascade-page">
      <nav className="cascade-nav">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <a className="flex items-center gap-3" href="#hero" onClick={() => setActiveLink("hero")}>
            <span className="cascade-side-panel flex size-10 items-center justify-center">
              <Droplets aria-hidden className="size-5" />
            </span>
            <span className="font-bold tracking-[-0.02em]">Cascade</span>
          </a>

          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <a
                className={`cascade-nav-link ${activeLink === link.id ? "is-active" : ""}`}
                href={`#${link.id}`}
                key={link.id}
                onClick={() => setActiveLink(link.id)}
              >
                {link.label}
              </a>
            ))}
          </div>

          <button
            className="cascade-button secondary"
            onClick={() => document.getElementById("form")?.scrollIntoView({ behavior: "smooth" })}
          >
            Contact
          </button>
        </div>
      </nav>

      <section className="cascade-hero px-6 text-center" id="hero">
        <div className="cascade-hero-stripe cascade-animated absolute inset-0" />
        <div className="cascade-depth-layer one" />
        <div className="cascade-depth-layer two" />
        <div className="cascade-depth-layer three" />

        <div className="relative z-10 mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr_280px] lg:items-center lg:text-left">
          <div className="scroll-reveal space-y-6">
            <span className="cascade-eyebrow">
              <Sparkles aria-hidden className="size-4" />
              Calm, flowing, deep, refreshing
            </span>
            <div className="space-y-4">
              <h1>Cascade</h1>
              <p className="cascade-copy mx-auto max-w-2xl lg:mx-0">
                A waterfall-themed Formzzz interface with midnight water surfaces, foam-bright accents,
                tactile ripples, and soft scroll reveals.
              </p>
            </div>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
              <button
                className="cascade-button primary"
                onClick={() => document.getElementById("cards")?.scrollIntoView({ behavior: "smooth" })}
              >
                View Components
                <ChevronRight aria-hidden className="size-4" />
              </button>
              <button
                className="cascade-button secondary"
                onClick={() => toast("Secondary ripple fired.")}
              >
                Test Ripple
              </button>
            </div>
          </div>

          <div className="cascade-side-panel cascade-animated scroll-reveal hidden min-h-[360px] p-6 lg:block">
            <div className="flex h-full flex-col justify-between text-left">
              <div>
                <h2>Water Depth</h2>
                <p className="cascade-copy mt-3">
                  Three overlapping layers sit under the hero content to create the sense of moving depth.
                </p>
              </div>
              <div className="space-y-3">
                <div className="h-2 rounded-full bg-[var(--cascade-accent-secondary)] opacity-80" />
                <div className="h-2 w-3/4 rounded-full bg-[var(--cascade-accent-primary)] opacity-70" />
                <div className="h-2 w-1/2 rounded-full bg-[var(--cascade-accent-glow)] opacity-60" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <WaveDivider />

      <section className="cascade-section" id="cards">
        <div className="scroll-reveal mx-auto mb-10 max-w-2xl text-center">
          <span className="cascade-eyebrow">Hover Lift</span>
          <h2 className="mt-4">Mist-Blur Card Grid</h2>
          <p className="cascade-copy mt-3">
            Each card uses the Cascade surface, 16px radius, 24px padding, border token, and a soft blue glow on hover.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <article className="cascade-card scroll-reveal" key={card.title}>
                <div className="mb-8 flex items-center justify-between">
                  <Icon aria-hidden className="size-5 text-[var(--cascade-accent-primary)]" />
                  <ArrowRight aria-hidden className="size-4 text-[var(--cascade-accent-secondary)]" />
                </div>
                <h3>{card.title}</h3>
                <p className="cascade-copy mt-3">{card.body}</p>
              </article>
            );
          })}
        </div>
      </section>

      <WaveDivider />

      <section className="cascade-section" id="form">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div className="scroll-reveal space-y-4">
            <span className="cascade-eyebrow">Ripple Form</span>
            <h2>Input and Action States</h2>
            <p className="cascade-copy">
              Inputs sit on the elevated water-depth surface with accent focus borders. The submit button creates
              the same circular ripple as every other button on the page.
            </p>
          </div>

          <form className="cascade-form scroll-reveal space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="cascade-email">Email</label>
              <input
                className="cascade-input"
                id="cascade-email"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@waterfall.dev"
                required
                type="email"
                value={email}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="cascade-note">Waterfall note</label>
              <input
                className="cascade-input"
                id="cascade-note"
                onChange={(event) => setNote(event.target.value)}
                placeholder="Tell us how the flow feels"
                type="text"
                value={note}
              />
            </div>

            <div className="flex flex-col gap-3 border-t border-[var(--cascade-border)] pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="cascade-copy">Focus rings, contrast, and reduced motion states are built into the theme.</p>
              <button className="cascade-button primary" disabled={isSubmitting} type="submit">
                {isSubmitting ? "Sending" : "Send"}
                <Send aria-hidden className="size-4" />
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
