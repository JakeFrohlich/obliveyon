"use client";

export default function Home() {
  return (
    <iframe
      src="/landing.html"
      title="Obliveyon — Dark Luxury Streetwear"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        border: "none",
        zIndex: 100,
      }}
    />
  );
}
