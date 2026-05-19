"use client";

export function AnimatedGradient() {
  return (
    <div className="animated-gradient-bg absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/* Primary blob */}
      <div className="gradient-blob gradient-blob-1" />
      {/* Secondary blob */}
      <div className="gradient-blob gradient-blob-2" />
      {/* Tertiary blob */}
      <div className="gradient-blob gradient-blob-3" />
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)]" />
    </div>
  );
}
