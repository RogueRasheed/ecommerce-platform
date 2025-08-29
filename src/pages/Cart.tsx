import { useCart } from "../store/useCart";
import { Link } from "react-router-dom";

export default function Cart() {
  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  // Calculate total
  const total = cart.reduce(
    (acc, item) => acc + item.price * (item.quantity || 1),
    0
  );

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      {cart.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="space-y-6">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-6 bg-white p-4 rounded-xl shadow"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h2 className="text-xl font-semibold">{item.name}</h2>
                <p className="text-gray-600">${item.price}</p>
                <div className="flex items-center gap-3 mt-2">
                  <button
                    onClick={() => decreaseQuantity(item.id)}
                    className="px-3 py-1 bg-gray-200 rounded"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => increaseQuantity(item.id)}
                    className="px-3 py-1 bg-gray-200 rounded"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">
                  ${(item.price * (item.quantity || 1)).toFixed(2)}
                </p>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 mt-2 hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          {/* Cart Footer */}
          <div className="flex justify-between items-center border-t pt-6">
            <h2 className="text-2xl font-bold">Total: ${total.toFixed(2)}</h2>
            <div className="flex gap-4">
              <button
                onClick={clearCart}
                className="bg-red-500 text-white px-6 py-2 rounded-lg shadow hover:bg-red-600"
              >
                Clear Cart
              </button>
              <Link
                to="/checkout"
                className="bg-green-500 text-white px-6 py-2 rounded-lg shadow hover:bg-green-600"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
