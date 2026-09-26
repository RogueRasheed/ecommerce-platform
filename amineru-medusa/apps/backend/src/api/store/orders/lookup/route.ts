import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

const normalizePhone = (value: string) => value.replace(/\D/g, "");

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const email = String(req.query.email ?? "").trim().toLowerCase();
  const phone = normalizePhone(String(req.query.phone ?? ""));

  if (!email || !phone) {
    return res.status(400).json({
      message: "Email and phone are both required.",
    });
  }

  if (phone.length < 7) {
    return res.status(400).json({
      message: "Enter a valid phone number.",
    });
  }

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  const { data: orders } = await query.graph({
    entity: "order",
    fields: [
      "id",
      "display_id",
      "email",
      "status",
      "created_at",
      "total",
      "items.*",
      "shipping_address.*",
    ],
    filters: {
      email,
    },
  });

  const matches = orders.filter((order: any) => {
    const orderPhone = normalizePhone(order.shipping_address?.phone ?? "");
    return orderPhone === phone;
  });

  return res.json({
    orders: matches,
  });
}
