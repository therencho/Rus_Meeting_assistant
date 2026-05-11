import { NavbarDemo } from "@/components/navbar";
import { TextFlippingBoardDemo }
from "@/components/hero";
import Footer from "@/components/footer";
import MeetingWorkspace from "@/components/input";
import PreviousMeetings from "@/components/previous-meetings";
import Contact from "@/components/contact";

export default function Home() {

  return (

    <main
      className="
        min-h-screen
        bg-[#0e1016]
        text-white
      "
    >

      <NavbarDemo />

      <div
        className="
          flex
          flex-col
          items-center
          justify-center
          pt-32
          px-6
        "
      >

        <TextFlippingBoardDemo />
        <MeetingWorkspace />
        <PreviousMeetings />
        <Contact />
        <Footer />

      </div>

    </main>
  );
}