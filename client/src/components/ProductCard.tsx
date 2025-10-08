import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../store/useCart";

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
};

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden flex flex-col">
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

        <div className="flex items-center justify-between mt-auto">
          <span className="text-[#009632] font-bold text-lg">
            ₦{product.price}
          </span>
          <button
            onClick={() => addToCart(product)}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-[#009632] text-white rounded-lg hover:bg-[#008020] transition"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
