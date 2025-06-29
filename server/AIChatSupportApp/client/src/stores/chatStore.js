import { makeAutoObservable } from "mobx";
import axios from "axios";

class ChatStore {
  messages = [];
  conversationId = null;
  conversations = [];

  constructor() {
    makeAutoObservable(this);
  }

  async sendMessage(text) {
    this.messages.push({ text, sender: "user" });
    console.log("Sending message, current messages:", this.messages);

    try {
      const response = await axios.post("http://localhost:5000/api/chat", {
        message: text,
        conversationId: this.conversationId,
      });
      console.log("API response data:", response.data);
      this.messages.push({ text: response.data.message, sender: "bot" });
      this.conversationId = response.data.conversationId;
      console.log("Updated messages after bot reply:", this.messages);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }

  async fetchHistory(conversationId) {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/chat/${conversationId}`
      );
      this.messages = response.data.messages;
      this.conversationId = response.data._id;
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  }

  async fetchConversations() {
    try {
      const response = await axios.get("http://localhost:5000/api/chat");
      this.conversations = response.data;
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  }

  clearChat() {
    this.messages = [];
    this.conversationId = null;
  }
}

const chatStore = new ChatStore();
export default chatStore;
