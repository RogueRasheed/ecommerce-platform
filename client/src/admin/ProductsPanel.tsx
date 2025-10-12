import { useEffect, useState } from "react";
import API_BASE_URL from "../config";

type Product = {
  _id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
};

export default function ProductsPanel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: 0,
    stock: 0,
    category: "",
  });

  async function fetchProducts() {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/products`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("❌ Failed to load products", err);
    } finally {
      setLoading(false);
    }
  }

  async function addProduct() {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });
      if (!res.ok) throw new Error("Failed to add product");
      fetchProducts();
      setNewProduct({ name: "", price: 0, stock: 0, category: "" });
    } catch (err) {
      console.error(err);
    }
  }

  async function deleteProduct(id: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete product");
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) return <p className="text-center">Loading products...</p>;

  return (
    <div className="overflow-x-auto">
      {/* Header + Add Product */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
        <h2 className="text-xl font-semibold">Products</h2>

        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            placeholder="Name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            className="border rounded px-2 py-1"
          />
          <input
            type="number"
            placeholder="Price"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
            className="border rounded px-2 py-1"
          />
          <input
            type="number"
            placeholder="Stock"
            value={newProduct.stock}
            onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
            className="border rounded px-2 py-1"
          />
          <input
            type="text"
            placeholder="Category"
            value={newProduct.category}
            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
            className="border rounded px-2 py-1"
          />
          <button
            onClick={addProduct}
            className="bg-[#009632] text-white px-4 py-1 rounded hover:bg-green-700 transition"
          >
            Add
          </button>
        </div>
      </div>

      {/* Refresh Button */}
      <div className="flex justify-end mb-2">
        <button
          onClick={fetchProducts}
          className="bg-gray-200 text-gray-800 px-4 py-1 rounded hover:bg-gray-300 transition"
        >
          Refresh
        </button>
      </div>

      {/* Products Table */}
      <table className="w-full border border-gray-200 bg-white rounded-lg shadow-md">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-3 border-b">Name</th>
            <th className="p-3 border-b">Category</th>
            <th className="p-3 border-b">Price</th>
            <th className="p-3 border-b">Stock</th>
            <th className="p-3 border-b">Action</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan={5} className="p-5 text-center text-gray-500">
                No products found
              </td>
            </tr>
          ) : (
            products.map((p) => (
              <tr key={p._id} className="border-b hover:bg-gray-50">
                <td className="p-3">{p.name}</td>
                <td className="p-3">{p.category}</td>
                <td className="p-3">₦{p.price}</td>
                <td className="p-3">{p.stock}</td>
                <td className="p-3">
                  <button
                    onClick={() => deleteProduct(p._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
