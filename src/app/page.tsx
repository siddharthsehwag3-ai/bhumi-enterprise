import Hero from "@/components/Hero/Hero";
import Batteries from "@/components/Batteries/Batteries";
import WifiServices from "@/components/WifiServices/WifiServices";

export default function Home() {
  return (
    <main>
      <Hero />
      <Batteries />
      <WifiServices />
    </main>
  );
}