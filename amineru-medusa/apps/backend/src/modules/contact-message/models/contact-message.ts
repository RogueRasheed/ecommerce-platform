import { model } from "@medusajs/framework/utils";

const ContactMessage = model.define("contact_message", {
  id: model.id().primaryKey(),
  name: model.text(),
  email: model.text(),
  subject: model.text().nullable(),
  message: model.text(),
});

export default ContactMessage;
