import { Request, Response } from "express";
import Message from "../models/Message";

// ✅ Create new message (from contact form)
export const createMessage = async (req: Request, res: Response) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newMessage = new Message({ name, email, subject, message });
    await newMessage.save();

    res.status(201).json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    console.error("❌ Error saving message:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Get all messages (for admin view)
export const getMessages = async (_req: Request, res: Response) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    console.error("❌ Error fetching messages:", error);
    res.status(500).json({ error: "Server error" });
  }
};
