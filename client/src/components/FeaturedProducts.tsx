import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../store/useCart";

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
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("http://localhost:3000/api/products");
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

  if (loading) return <p className="text-center">Loading...</p>;

  const featured = products.slice(0, 3);

  return (
    <section id="highlight-section" className="py-20 bg-gray-50 text-gray-900">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12">
          Featured Products
        </h2>

        <div className="grid gap-8 md:grid-cols-3 mb-12">
                  {featured.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden"
            >
              <Link to={`/products/${product._id}`}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  <span className="block text-indigo-500 font-bold mb-4">
                    ${product.price}
                  </span>
                </div>
              </Link>

              <div className="px-6 pb-6">
                <button
                  onClick={() => addToCart(product)}
                  className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition font-medium"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        <Link
          to="/products"
          className="inline-block px-6 py-3 text-white bg-indigo-600 hover:bg-indigo-700 rounded-full font-medium transition"
        >
          See All Products
        </Link>
      </div>
    </section>
  );
}
