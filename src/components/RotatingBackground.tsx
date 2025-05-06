"use client";

import Image from "next/image";

export function RotatingBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <Image
        src="/images/golden-pattern.png"
        alt="Golden geometric pattern"
        fill
        className="object-cover animate-spin-slow opacity-10"
        priority
      />
    </div>
  );
}
