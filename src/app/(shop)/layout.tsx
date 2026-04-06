import Navbar from "@/components/layout/Navbar";
import LevelBar from "@/components/ui/LevelBar";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <LevelBar />
      {children}
    </>
  );
}
