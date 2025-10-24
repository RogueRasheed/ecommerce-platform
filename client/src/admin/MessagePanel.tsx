import { useEffect, useState } from "react";
import API_BASE_URL from "../config";

type Message = {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
};

export default function MessagesPanel() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchMessages() {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/message/messages`);
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error("❌ Failed to load messages", err);
    } finally {
      setLoading(false);
    }
  }

  async function deleteMessage(id: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/message/messages/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete message");
      fetchMessages();
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchMessages();
  }, []);

  if (loading) return <p className="text-center">Loading messages...</p>;

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Messages</h2>
        <button
          onClick={fetchMessages}
          className="bg-[#009632] text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Refresh
        </button>
      </div>

      <table className="w-full border border-gray-200 bg-white rounded-lg shadow-md">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-3 border-b">Name</th>
            <th className="p-3 border-b">Email</th>
            <th className="p-3 border-b">Subject</th>
            <th className="p-3 border-b">Message</th>
            <th className="p-3 border-b">Date</th>
            <th className="p-3 border-b">Action</th>
          </tr>
        </thead>
        <tbody>
          {messages.length === 0 ? (
            <tr>
              <td colSpan={6} className="p-5 text-center text-gray-500">
                No messages found
              </td>
            </tr>
          ) : (
            messages.map((msg) => (
              <tr key={msg._id} className="border-b hover:bg-gray-50">
                <td className="p-3">{msg.name}</td>
                <td className="p-3">{msg.email}</td>
                <td className="p-3">{msg.subject}</td>
                <td className="p-3">{msg.message}</td>
                <td className="p-3">
                  {new Date(msg.createdAt).toLocaleDateString()}
                </td>
                <td className="p-3">
                  <button
                    onClick={() => deleteMessage(msg._id)}
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
