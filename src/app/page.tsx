import Image from "next/image";
import HeroCard from "./CardHero";

export default function Home() {
  return (<div className="flex min-h-screen w-full flex-col items-center justify-between">
    <HeroCard />
  </div>
  );
}
