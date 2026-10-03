import { Dock } from "@/components/dock";
import { FindUs } from "@/components/find-us";
import { Footer } from "@/components/footer";
import { Header, LiftIntro } from "@/components/header";
import { Deli, Grill, Hero, Order, Salad, Today } from "@/components/stations";
import { Catering, Reviews } from "@/components/reviews";
import { ScrollDirector } from "@/components/scroll-director";
import { TrayStage } from "@/components/tray-stage";
import { restaurantJsonLd } from "@/lib/structured-data";

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantJsonLd).replace(/</g, "\\u003c") }}
      />
      <LiftIntro />
      <Header />
      <TrayStage />

      <main>
        {/* The line: stations hang off the rail on the left while the tray rides on the right. */}
        <div className="line" id="line">
          <div className="rail" id="rail" />
          <Hero />
          <Today />
          <Deli />
          <Grill />
          <Salad />
          <Order />
        </div>
        <FindUs />
        <Reviews />
        <Catering />
      </main>

      <Footer />
      <Dock />
      <ScrollDirector />
    </>
  );
}
