import { useState } from "react";
import { useCart } from "../store/useCart";
import { useNavigate } from "react-router-dom";

export default function CheckoutPage() {
  const { cart, clearCart, increaseQuantity, decreaseQuantity, removeFromCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const navigate = useNavigate();

  const total = cart.reduce(
    (acc, item) => acc + item.price * (item.quantity || 1),
    0
  );

  if (orderPlaced) {
    return (
      <div className="max-w-xl mx-auto px-6 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">🎉 Thank You!</h1>
        <p className="text-gray-600 mb-6">
          Your order has been placed successfully. A confirmation email will be
          sent shortly.
        </p>
        <button
          onClick={() => setOrderPlaced(false)}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

const handlePlaceOrder = (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  setTimeout(() => {
    const order = {
      id: Date.now().toString(), // unique order ID
      items: cart,
      total,
      date: new Date().toLocaleString(),
      status: "processing", // 🔑 start with processing
    };

    // ✅ Save latest order
    localStorage.setItem("lastOrder", JSON.stringify(order));

    // ✅ Append to order history
    const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    const updatedOrders = [...existingOrders, order];
    localStorage.setItem("orders", JSON.stringify(updatedOrders));

    // ✅ Clear cart
    clearCart();

    setLoading(false);

    // ✅ Navigate to order tracking page
    navigate(`/order/${order.id}/status`);
  }, 1500);
};



  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      {cart.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-10">

            {/* Order Summary */}
            <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
            <div className="divide-y">
                {cart.map((item) => (
                <div
                    key={item.id}
                    className="flex items-center justify-between py-4"
                >
                    <div className="flex items-center gap-4">
                    {/* Product Thumbnail */}
                    {item.image && (
                        <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md border"
                        />
                    )}
                    <div>
                        <p className="font-medium">{item.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                        {/* Quantity Controls */}
                        <button
                            onClick={() => decreaseQuantity(item.id)}
                            className="px-2 py-1 border rounded hover:bg-gray-100"
                        >
                            ➖
                        </button>
                        <span className="font-medium">{item.quantity}</span>
                        <button
                            onClick={() => increaseQuantity(item.id)}
                            className="px-2 py-1 border rounded hover:bg-gray-100"
                        >
                            ➕
                        </button>
                        </div>
                    </div>
                    </div>

                    <div className="flex items-center gap-4">
                    <span className="font-semibold">
                        ${(item.price * (item.quantity || 1)).toFixed(2)}
                    </span>
                    <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 transition text-sm"
                    >
                        ❌
                    </button>
                    </div>
                </div>
                ))}
            </div>

            {/* Total */}
            <div className="border-t mt-4 pt-4 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
            </div>
            </div>



          {/* Checkout Form */}
          <form
            onSubmit={handlePlaceOrder}
            className="bg-white p-6 rounded-xl shadow space-y-4"
          >
            <h2 className="text-2xl font-semibold mb-4">Shipping Details</h2>

            <input
              type="text"
              placeholder="Full Name"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="email"
              placeholder="Email Address"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              placeholder="City"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              placeholder="Home Address"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />

            <select
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select Payment Method</option>
              <option value="card">Credit/Debit Card</option>
              <option value="paypal">PayPal</option>
              <option value="cod">Cash on Delivery</option>
            </select>

            <button
              type="submit"
              onClick={handlePlaceOrder}
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg shadow hover:bg-indigo-700 disabled:opacity-60"
            >
              {loading ? "Processing..." : "Place Order"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
