import { ShieldCheck, Truck, Leaf, Users } from "lucide-react";

export default function WhyChooseUs() {
  const items = [
    {
      icon: <ShieldCheck size={36} className="text-[#009632]" />,
      title: "Certified Quality",
      desc: "Our products are NAFDAC, FDA, and HACCP compliant to ensure premium standards.",
    },
    {
      icon: <Truck size={36} className="text-[#009632]" />,
      title: "Reliable Delivery",
      desc: "Fast, safe, and nationwide delivery with international reach.",
    },
    {
      icon: <Leaf size={36} className="text-[#009632]" />,
      title: "Nutritious & Natural",
      desc: "Processed under strict hygienic conditions to retain nutrients.",
    },
    {
      icon: <Users size={36} className="text-[#009632]" />,
      title: "Farmer Empowerment",
      desc: "We support local farmers, create jobs, and empower women & youth.",
    },
  ];

  return (
    <section className="py-20 bg-gray-50 text-gray-900">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-12">Why Choose Us?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition transform hover:-translate-y-1"
            >
              <div className="flex justify-center mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
