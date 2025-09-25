import aboutimg from "../assets/Logo2.jpeg";


export default function About() {
  return (
    <section className="py-20 bg-gray-50 text-gray-900">
      <div className="max-w-5xl mx-auto px-6 text-center">
        {/* Heading */}
        <h1 className="text-4xl font-bold mb-6">About Amineru Nigeria Enterprises</h1>
        <p className="text-lg text-gray-600 mb-12">
          At <span className="font-semibold text-[#009632]">Amineru Nigeria Enterprises</span>, we believe shopping
          should be simple, enjoyable, and stress-free. That’s why we’ve built
          a store where quality products meet unbeatable convenience.
        </p>

        {/* Mission / Values */}
        <div className="grid md:grid-cols-2 gap-8 text-left">
          <div className="bg-white shadow-md rounded-2xl p-6 
                hover:shadow-xl hover:scale-105 transition transform duration-300 ease-in-out">
            <h3 className="text-xl font-semibold mb-2">Our Mission</h3>
            <p className="text-gray-600">
              To provide premium, nutritious, and affordable agro-based food flour products while empowering farmers and creating jobs.
            </p>
          </div>
          <div className="bg-white shadow-md rounded-2xl p-6 
                hover:shadow-xl hover:scale-105 transition transform duration-300 ease-in-out">
            <h3 className="text-xl font-semibold mb-2">Our Vision</h3>
            <p className="text-gray-600">
             To be a leading Nigerian brand in agro-food processing, recognized for excellence, quality, and availability at the next shop.
            </p>
          </div>
        </div>

        {/* Image + Story Section */}
        <div className="mt-20 grid md:grid-cols-2 gap-12 items-center text-left">
          {/* Image */}
          <img
            src={aboutimg} // replace with your local image path
            alt="About Amineru Nigeria Enterprises"
            className="rounded-2xl shadow-lg w-2xl h-auto object-cover"
          />

          {/* Text */}
          <div>
            <h2 className="text-5xl text-[#009632] font-bold mb-4">Our Story</h2>
            <p className="text-gray-600 mb-4">
              Amineru Nigeria Enterprises Ltd (Trademark: Amineru Foods) is an agro-processing and food packaging company based in Benin City, Nigeria. 
              We specialize in nutritious staple foods, processed under strict hygienic conditions for local and international consumption.
            </p>
            <p className="text-gray-600">
              Whether it’s your first time shopping with us or your fiftieth, we
              want you to feel confident knowing you’ll always get the best
              quality and service.
            </p>
          </div>
        </div>
                  {/* Certifications & Governance */}
        <div className="mt-20 text-left">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Certifications, Compliance & Corporate Governance
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-center mb-8">
            We hold trademarks and certifications from various regulatory bodies, reinforcing 
            our commitment to compliance, governance, and industry best practices.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white shadow-md rounded-2xl p-6 
                hover:shadow-xl hover:scale-105 transition transform duration-300 ease-in-out">

              <h3 className="text-lg font-semibold mb-3 text-[#009632]">Regulatory Certifications</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>NAFDAC Registered</li>
                <li>FDA (USA) Certified</li>
                <li>HACCP Compliant</li>
                <li>Nigeria Export Promotion Council (NEPC) Registered</li>
              </ul>
            </div>

            <div className="bg-white shadow-md rounded-2xl p-6 
                hover:shadow-xl hover:scale-105 transition transform duration-300 ease-in-out">
              <h3 className="text-lg font-semibold mb-3 text-[#009632]">Trade & Business Associations</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>BENCCIMA</li>
                <li>WCCIMA</li>
                <li>Nigerian German Chamber of Commerce (NGCC)</li>
                <li>Abuja Chamber of Commerce (ACCI)</li>
                <li>Women in Export Trade & Investment (WETI)</li>
                <li>Made in Africa Brand Ambassadors (MABA)</li>
                <li>Edo Licensed Exporters Association</li>
                <li>Edo Shippers Association</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Market Presence */}
        <div className="mt-20 text-left">
          <h2 className="text-2xl font-bold mb-6 text-center">Market Presence</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-center mb-8">
            Amineru Foods continues to expand its reach across Nigeria, Africa, and beyond.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <span className="px-4 py-2 bg-green-100 text-green-700 font-semibold rounded-lg shadow-sm 
                 hover:shadow-md hover:scale-105 transition transform duration-300 ease-in-out cursor-pointer">
              Nigeria & West Africa
            </span>
            <span className="px-4 py-2 bg-green-100 text-green-700 font-semibold rounded-lg shadow-sm 
                 hover:shadow-md hover:scale-105 transition transform duration-300 ease-in-out cursor-pointer">
              Miami, Florida, USA
            </span>
            <span className="px-4 py-2 bg-green-100 text-green-700 font-semibold rounded-lg shadow-sm 
                 hover:shadow-md hover:scale-105 transition transform duration-300 ease-in-out cursor-pointer">
              Halifax, Nova Scotia, Canada
            </span>
            <span className="px-4 py-2 bg-green-100 text-green-700 font-semibold rounded-lg shadow-sm 
                 hover:shadow-md hover:scale-105 transition transform duration-300 ease-in-out cursor-pointer">
              Expanding to the UK and EU
            </span>
          </div>
        </div>

                  {/* CSR & Social Impact */}
          <div className="mt-20 text-left">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Corporate Social Responsibility (CSR) & Social Impact Initiatives
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-center mb-8">
              At Amineru Nigeria Enterprises, we believe in giving back to our host communities 
              and fostering sustainable development across Nigeria and beyond.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white shadow-md rounded-2xl p-6 
                hover:shadow-xl hover:scale-105 transition transform duration-300 ease-in-out">

                <h3 className="text-lg font-semibold mb-3 text-[#009632]">Community Development</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Provision of free water to host community</li>
                  <li>Support for local security initiatives</li>
                  <li>Electricity and road infrastructure improvements</li>
                  <li>Participation in town hall, market, and police station projects</li>
                </ul>
              </div>

              <div className="bg-white shadow-md rounded-2xl p-6 
                hover:shadow-xl hover:scale-105 transition transform duration-300 ease-in-out">

                <h3 className="text-lg font-semibold mb-3 text-[#009632]">Empowerment & Inclusion</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Over 75% of staff recruited from host communities</li>
                  <li>Women & youth empowerment initiatives</li>
                  <li>Farmer inclusion & off-take agreements</li>
                  <li>Job creation across the agro-processing value chain</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Key Achievements */}
          <div className="mt-20 text-left">
            <h2 className="text-2xl font-bold mb-6 text-center">Key Achievements</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-center mb-8">
              Our journey has been marked by significant milestones and global recognition.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <span className="px-4 py-2 bg-green-100 text-green-700 font-semibold rounded-lg shadow-sm 
                 hover:shadow-md hover:scale-105 transition transform duration-300 ease-in-out cursor-pointer">
                Intra African Trade Fair (IATF) – Cairo, Egypt (2023)
              </span>
              <span className="px-4 py-2 bg-green-100 text-green-700 font-semibold rounded-lg shadow-sm 
                 hover:shadow-md hover:scale-105 transition transform duration-300 ease-in-out cursor-pointer">
                SIAL Trade Show – Montreal, Canada (2024)
              </span>
              <span className="px-4 py-2 bg-green-100 text-green-700 font-semibold rounded-lg shadow-sm 
                 hover:shadow-md hover:scale-105 transition transform duration-300 ease-in-out cursor-pointer">
                MSME Africa Forum – Windhoek, Namibia (2024)
              </span>
            </div>
          </div>


        {/* Closing */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-4">Why Amineru Nigeria Enterprises?</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Because shopping shouldn’t feel like a chore. With Amineru Nigeria Enterprises, you’ll
            find trusted products, fair prices, and a team that cares about
            making every order special.
          </p>
        </div>
      </div>
    </section>
  );
}
