const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");

router.post("/", chatController.sendMessage);
router.get("/", chatController.getConversations);
router.get("/:id", chatController.getConversation);
router.delete("/:id", chatController.deleteConversation);

module.exports = router;
