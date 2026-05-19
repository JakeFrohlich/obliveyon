import Navbar from "@/components/layout/Navbar";
// import LevelBar from "@/components/ui/LevelBar"; // TODO: re-enable when ranking system is ready

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {/* <LevelBar /> */}
      {children}
    </>
  );
}
