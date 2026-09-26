import { MedusaService } from "@medusajs/framework/utils";
import ContactMessage from "./models/contact-message";

class ContactMessageModuleService extends MedusaService({
  ContactMessage,
}) {}

export default ContactMessageModuleService;
