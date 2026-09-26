import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

type ContactMessage = {
  name: string;
  email: string;
  subject?: string;
  message: string;
};

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { name, email, subject, message } = req.body as ContactMessage;

  if (!name || !email || !message) {
    return res.status(400).json({
      message: "Name, email, and message are required.",
    });
  }

  const contactMessageService = req.scope.resolve(
    "contactMessage"
  );

  await contactMessageService.createContactMessages({
    name,
    email,
    subject: subject || null,
    message,
  });

  return res.status(201).json({
    success: true,
    message: "Message sent successfully.",
  });
}
