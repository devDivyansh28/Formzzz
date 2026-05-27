"use client";

import { useEffect } from "react";

/**
 * RippleProvider
 * Detects clicks on all enabled buttons, then creates the expanding
 * circular ripple required by the Cascade motion system.
 */
export function RippleProvider() {
  useEffect(() => {
    const handleButtonClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("button");
      if (!target) return;
      if (target.disabled) return;

      const rect = target.getBoundingClientRect();
      const diameter = Math.max(rect.width, rect.height);
      const radius = diameter / 2;

      const ripple = document.createElement("span");
      ripple.className = "ripple-effect";
      ripple.style.width = ripple.style.height = `${diameter}px`;
      ripple.style.left = `${e.clientX - rect.left - radius}px`;
      ripple.style.top = `${e.clientY - rect.top - radius}px`;

      // Clear previous ripples on the same element
      const oldRipples = target.querySelectorAll(".ripple-effect");
      oldRipples.forEach((r) => r.remove());

      // Ensure proper positioning container context
      const originalPosition = window.getComputedStyle(target).position;
      if (originalPosition === "static") {
        target.style.position = "relative";
      }
      target.style.overflow = "hidden";

      target.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    };

    document.addEventListener("click", handleButtonClick);
    return () => document.removeEventListener("click", handleButtonClick);
  }, []);

  return null;
}

/**
 * ScrollRevealProvider
 * Uses IntersectionObserver at a 0.15 threshold for the fade-in and
 * 20px slide-up scroll reveal.
 */
export function ScrollRevealProvider() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-active");
            observer.unobserve(entry.target); // Trigger once
          }
        });
      },
      { threshold: 0.15 }
    );

    const revealElements = document.querySelectorAll(".scroll-reveal");
    revealElements.forEach((el) => observer.observe(el));

    // Optional: Mutation observer to observe dynamically loaded/rendered forms/items later
    const mutationObserver = new MutationObserver(() => {
      const elements = document.querySelectorAll(".scroll-reveal:not(.reveal-active)");
      elements.forEach((el) => observer.observe(el));
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return null;
}
