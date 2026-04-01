"use client";

export default function MedievalBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Video background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 0.75 }}
      >
        <source src="/hf_20260328_164355_d37389fa-13d8-4a9b-a53e-6bd707a35633.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay to keep it moody */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 50% 30%, rgba(10,8,5,0.2) 0%, rgba(5,4,3,0.4) 100%)",
        }}
      />


      {/* Fog layers */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(0deg, rgba(20,18,14,0.8) 0%, transparent 30%, transparent 70%, rgba(10,9,7,0.4) 100%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 30% 80%, rgba(80,70,50,0.06) 0%, transparent 50%)",
          animation: "fogDrift 20s ease-in-out infinite alternate",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 70% 70%, rgba(80,70,50,0.04) 0%, transparent 50%)",
          animation: "fogDrift 25s ease-in-out infinite alternate-reverse",
        }}
      />

      {/* Film grain overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          animation: "grain 8s steps(10) infinite",
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(0,0,0,0.6) 100%)",
        }}
      />
    </div>
  );
}
