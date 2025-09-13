import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
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

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>(); // route param (make sure route is `/products/:id`)
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const addToCart = useCart((state) => state.addToCart);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`http://localhost:3000/api/products/${id}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error("❌ Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="p-6 text-center">Loading product...</div>;
  }

  if (!product) {
    return <div className="p-6 text-center">❌ Product not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 grid md:grid-cols-2 gap-8">
      {/* Product Image */}
      <div className="flex justify-center items-center">
        <img
          src={product.image}
          alt={product.name}
          className="rounded-xl w-full max-h-[400px] object-cover"
        />
      </div>

      {/* Product Info */}
      <div className="flex flex-col justify-center">
        <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
        <p className="text-gray-600 mb-4">{product.description}</p>
        <p className="text-xl font-semibold text-blue-600 mb-6">
          ${product.price}
        </p>

        <div className="flex gap-4">
          <button
            onClick={() => addToCart(product)}
            className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            Add to Cart
          </button>

          <Link
            to="/products"
            className="px-6 py-3 rounded-xl bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition"
          >
            ← Back to Products
          </Link>
        </div>
      </div>
    </div>
  );
}
