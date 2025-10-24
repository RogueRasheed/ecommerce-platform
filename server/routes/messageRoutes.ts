import express from "express";
import { createMessage, getMessages } from "../controllers/messageController";

const router = express.Router();

router.post("/contact", createMessage);
router.get("/messages", getMessages);

export default router;
