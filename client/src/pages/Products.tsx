import { useEffect, useState } from "react";
import { useCart } from "../store/useCart";
import { ShoppingCart } from "lucide-react";
import useSearch from "../utils/SearchHook";
import { Link } from "react-router-dom";
import API_BASE_URL from "../config";

type Product = {
  _id: string;   // MongoDB uses _id
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  stock: number;
};

export default function Products() {
  const { addToCart } = useCart();
  const { searchQuery } = useSearch();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(`${API_BASE_URL}/products`); // ✅ fetch from backend
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <p className="text-center text-gray-600">Loading products...</p>;
  }

  return (
    <section className="py-20 bg-gray-50 text-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
          Our Products
        </h2>

        {filteredProducts.length === 0 ? (
          <p className="text-center text-gray-600">No products found.</p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <div
                key={product._id} // ✅ use MongoDB _id
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden flex flex-col"
              >
                <Link to={`/products/${product._id}`}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-56 object-cover"
                  />
                </Link>

                <div className="p-6 flex-1 flex flex-col">
                  <Link to={`/products/${product._id}`}>
                    <h3 className="text-lg font-semibold mb-2 hover:text-[#009632] transition">
                      {product.name}
                    </h3>
                  </Link>

                  <p className="text-gray-600 text-sm flex-1 mb-4">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-[#009632] font-bold text-lg">
                      ${product.price}
                    </span>
                    <button
                      onClick={() => addToCart(product)} 
                      className="flex items-center gap-2 px-3 py-2 text-sm bg-[#009632] text-white rounded-lg hover:bg-[#009632] transition"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
