const { OpenAI } = require("openai");
const Conversation = require("../models/conversation");
const Faq = require("../models/faq");

// Configure the OpenAI client for Azure
const client = new OpenAI({
  apiKey: process.env.AZURE_OPENAI_KEY,
  baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT}`,
  defaultQuery: { "api-version": "2024-02-15-preview" },
  defaultHeaders: { "api-key": process.env.AZURE_OPENAI_KEY },
});

const systemPrompt =
  "You are a helpful and friendly customer support agent. Your goal is to assist users with their questions and provide accurate information. If you don't know the answer, say so honestly. Be concise and clear in your responses.";

exports.sendMessage = async (req, res) => {
  const { message, conversationId } = req.body;

  try {
    let conversation;

    if (conversationId) {
      conversation = await Conversation.findById(conversationId);
    } else {
      conversation = new Conversation();
    }

    conversation.messages.push({ text: message, sender: "user" });

    // Search for a relevant FAQ
    const faq = await Faq.findOne({
      question: { $regex: new RegExp(message, "i") },
    });

    let botMessageText;

    if (faq) {
      botMessageText = faq.answer;
    } else {
      const history = conversation.messages.map((msg) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.text,
      }));

      const messagesWithSystemPrompt = [
        { role: "system", content: systemPrompt },
        ...history,
      ];

      const response = await client.chat.completions.create({
        messages: messagesWithSystemPrompt,
        // model is not needed for Azure deployment when baseURL includes deployment name
      });
      botMessageText = response.choices[0].message.content;
    }

    conversation.messages.push({ text: botMessageText, sender: "bot" });
    await conversation.save();

    res.json({
      message: botMessageText,
      conversationId: conversation._id,
    });
  } catch (error) {
    console.error("Error processing message:", error);
    res.status(500).json({ error: "Error processing message" });
  }
};

exports.getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find().sort({ createdAt: -1 });
    res.json(conversations);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({ error: "Error fetching conversations" });
  }
};

exports.getConversation = async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }
    res.json(conversation);
  } catch (error) {
    console.error("Error fetching conversation:", error);
    res.status(500).json({ error: "Error fetching conversation" });
  }
};

exports.deleteConversation = async (req, res) => {
  try {
    const conversationId = req.params.id;
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    await Conversation.findByIdAndDelete(conversationId);
    res.json({ message: "Conversation deleted successfully" });
  } catch (error) {
    console.error("Error deleting conversation:", error);
    res.status(500).json({ error: "Error deleting conversation" });
  }
};
