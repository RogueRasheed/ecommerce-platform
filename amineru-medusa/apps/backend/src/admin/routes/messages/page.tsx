import { defineRouteConfig } from "@medusajs/admin-sdk";
import { ChatBubbleLeftRight } from "@medusajs/icons";
import { Container, Heading, Text } from "@medusajs/ui";
import { useQuery } from "@tanstack/react-query";

import { sdk } from "../../lib/sdk";

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  created_at: string;
};

const MessagesPage = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["contact-messages"],
    queryFn: async () => {
      const response = await sdk.client.fetch<{
        messages: ContactMessage[];
        count: number;
      }>("/admin/contact-messages");

      return response;
    },
  });

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading level="h1">Messages</Heading>
          <Text className="text-ui-fg-subtle">
            Customer messages submitted through the storefront.
          </Text>
        </div>
      </div>

      <div className="p-6">
        {isLoading && <Text>Loading messages...</Text>}

        {error && (
          <Text className="text-ui-fg-error">
            Failed to load messages.
          </Text>
        )}

        {!isLoading && !error && data?.messages.length === 0 && (
          <Text>No messages yet.</Text>
        )}

        {!isLoading && !error && data?.messages.length > 0 && (
          <div className="flex flex-col gap-4">
            {data.messages.map((message) => (
              <div
                key={message.id}
                className="rounded-lg border border-ui-border-base p-4"
              >
                <div className="mb-2 flex items-start justify-between gap-4">
                  <div>
                    <Text weight="plus">{message.name}</Text>
                    <Text className="text-ui-fg-subtle">
                      {message.email}
                    </Text>
                  </div>

                  <Text className="text-ui-fg-subtle">
                    {new Date(message.created_at).toLocaleString()}
                  </Text>
                </div>

                {message.subject && (
                  <Text weight="plus" className="mb-2">
                    {message.subject}
                  </Text>
                )}

                <Text>{message.message}</Text>
              </div>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
};

export const config = defineRouteConfig({
  label: "Messages",
  icon: ChatBubbleLeftRight,
});

export default MessagesPage;
