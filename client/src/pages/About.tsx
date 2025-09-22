import aboutimg from "../assets/campaign-creators-qCi_MzVODoU-unsplash.jpg"



export default function About() {
  return (
    <section className="py-20 bg-gray-50 text-gray-900">
      <div className="max-w-5xl mx-auto px-6 text-center">
        {/* Heading */}
        <h1 className="text-4xl font-bold mb-6">About ShopEase</h1>
        <p className="text-lg text-gray-600 mb-12">
          At <span className="font-semibold text-[#009632]">ShopEase</span>, we believe shopping
          should be simple, enjoyable, and stress-free. That’s why we’ve built
          a store where quality products meet unbeatable convenience.
        </p>

        {/* Mission / Values */}
        <div className="grid md:grid-cols-3 gap-8 text-left">
          <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-2">Our Mission</h3>
            <p className="text-gray-600">
              To make shopping effortless by offering hand-picked products that
              add value to your everyday life.
            </p>
          </div>
          <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-2">Our Values</h3>
            <p className="text-gray-600">
              Integrity, customer care, and quality come first in everything we
              do — because you deserve the best.
            </p>
          </div>
          <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-2">Our Promise</h3>
            <p className="text-gray-600">
              From fast shipping to easy returns, we promise a shopping
              experience you’ll love.
            </p>
          </div>
        </div>

        {/* Image + Story Section */}
        <div className="mt-20 grid md:grid-cols-2 gap-12 items-center text-left">
          {/* Image */}
          <img
            src={aboutimg} // replace with your local image path
            alt="About ShopEase"
            className="rounded-2xl shadow-lg object-cover w-full h-96"
          />

          {/* Text */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Our Story</h2>
            <p className="text-gray-600 mb-4">
              ShopEase was founded with one simple goal — to make shopping as
              easy and enjoyable as possible. We started small, with a handful
              of products and a big vision, and have grown into a trusted
              destination for thousands of happy customers.
            </p>
            <p className="text-gray-600">
              Whether it’s your first time shopping with us or your fiftieth, we
              want you to feel confident knowing you’ll always get the best
              quality and service.
            </p>
          </div>
        </div>

        {/* Closing */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-4">Why ShopEase?</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Because shopping shouldn’t feel like a chore. With ShopEase, you’ll
            find trusted products, fair prices, and a team that cares about
            making every order special.
          </p>
        </div>
      </div>
    </section>
  );
}
