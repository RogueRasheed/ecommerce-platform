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
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

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
      setSelectedMessage(null); // close modal if open
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
            <th className="p-3 border-b">Date</th>
            <th className="p-3 border-b">Action</th>
          </tr>
        </thead>
        <tbody>
          {messages.length === 0 ? (
            <tr>
              <td colSpan={5} className="p-5 text-center text-gray-500">
                No messages found
              </td>
            </tr>
          ) : (
            messages.map((msg) => (
              <tr
                key={msg._id}
                className="border-b hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedMessage(msg)}
              >
                <td className="p-3">{msg.name}</td>
                <td className="p-3">{msg.email}</td>
                <td className="p-3">{msg.subject}</td>
                <td className="p-3">{new Date(msg.createdAt).toLocaleDateString()}</td>
                <td className="p-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // prevent modal opening
                      deleteMessage(msg._id);
                    }}
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

      {/* Modal */}
              {selectedMessage && (
          <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white/95 rounded-lg shadow-lg w-11/12 max-w-lg p-6 relative">
              <button
                onClick={() => setSelectedMessage(null)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              >
                ✖
              </button>
              <h3 className="text-xl font-semibold mb-2">{selectedMessage.subject}</h3>
              <p className="text-sm text-gray-500 mb-4">
                From: {selectedMessage.name} ({selectedMessage.email})
              </p>
              <p className="text-gray-700 whitespace-pre-line">{selectedMessage.message}</p>
              <div className="mt-6 flex justify-end gap-2">
                <button
                  onClick={() => deleteMessage(selectedMessage._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                >
                  Delete
                </button>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

    </div>
  );
}
