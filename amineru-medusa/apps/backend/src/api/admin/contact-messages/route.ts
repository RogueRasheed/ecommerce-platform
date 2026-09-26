import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  const { data: messages, metadata } = await query.graph({
    entity: "contact_message",
    fields: [
      "id",
      "name",
      "email",
      "subject",
      "message",
      "created_at",
    ],
    pagination: {
      take: 50,
      skip: 0,
      order: {
        created_at: "DESC",
      },
    },
  });

  return res.json({
    messages,
    count: metadata?.count ?? messages.length,
  });
}
