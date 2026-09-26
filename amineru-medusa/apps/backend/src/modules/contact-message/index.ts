import { Module } from "@medusajs/framework/utils";
import ContactMessageModuleService from "./service";

export const CONTACT_MESSAGE_MODULE = "contactMessage";

export default Module(CONTACT_MESSAGE_MODULE, {
  service: ContactMessageModuleService,
});
