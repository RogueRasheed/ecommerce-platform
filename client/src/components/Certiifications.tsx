import nafdac from "../assets/nafdac.png";
import fda from "../assets/fda.jpg";
import haccp from "../assets/haccp.jpg";
import nepc from "../assets/Nepc.png";

export default function Certifications() {
  const logos = [nafdac, fda, haccp, nepc];

  return (
    <section className="py-16 bg-white text-center">
      <h2 className="text-2xl font-bold mb-8">Our Certifications</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-12 gap-y-8 justify-items-center items-center">
      {logos.map((logo, i) => (
        <img
          key={i}
          src={logo}
          alt="Certification"
          className="h-16 w-auto object-contain grayscale hover:grayscale-0 transition"
        />
      ))}
    </div>
    </section>
  );
}
