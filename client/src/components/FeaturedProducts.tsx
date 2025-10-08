import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_BASE_URL from "../config";
import ProductCard from "../components/ProductCard";

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category?: string;
  stock: number;
};

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(`${API_BASE_URL}/products`);
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("❌ Failed to fetch products", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;

  const featured = products.slice(0, 3);

  return (
    <section className="py-20 bg-gray-50 text-gray-900">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12">
          Featured Products
        </h2>

        {featured.length === 0 ? (
          <p className="text-gray-600">No featured products available.</p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 mb-12">
            {featured.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        <Link
          to="/products"
          className="inline-block px-6 py-3 bg-[#009632] text-white rounded-full font-medium hover:bg-[#008020] transition"
        >
          See All Products
        </Link>
      </div>
    </section>
  );
}
