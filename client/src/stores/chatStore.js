import { makeAutoObservable } from "mobx";
import axios from "axios";

// Get API URL from environment variable or default to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

class ChatStore {
  messages = [];
  conversationId = null;
  conversations = [];

  // Track if conversations have been loaded at least once
  conversationsLoaded = false;

  // Track last fetch time to avoid too frequent requests
  lastFetchTime = 0;

  // Minimum time between fetches (in milliseconds)
  minFetchInterval = 5000; // 5 seconds

  // Loading and error states
  isLoadingConversations = false;
  conversationsError = null;

  constructor() {
    makeAutoObservable(this);
  }

  async sendMessage(text) {
    this.messages.push({ text, sender: "user" });
    console.log("Sending message, current messages:", this.messages);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/chat`, {
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
        `${API_BASE_URL}/api/chat/${conversationId}`
      );
      this.messages = response.data.messages;
      this.conversationId = response.data._id;
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  }

  async fetchConversations(force = false) {
    const now = Date.now();

    // Skip if recently fetched unless forced
    if (
      !force &&
      this.conversationsLoaded &&
      now - this.lastFetchTime < this.minFetchInterval
    ) {
      console.log("Skipping fetch - too recent");
      return;
    }

    this.isLoadingConversations = true; // Set loading state to true
    this.conversationsError = null; // Reset error state

    try {
      console.log("Fetching conversations...");
      const response = await axios.get(`${API_BASE_URL}/api/chat`);
      this.conversations = response.data;
      this.conversationsLoaded = true;
      this.lastFetchTime = now;
      console.log(`Fetched ${this.conversations.length} conversations`);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      this.conversationsError = error; // Set error state
      // Don't update conversationsLoaded on error to allow retry
    } finally {
      this.isLoadingConversations = false; // Reset loading state
    }
  }

  // Method to refresh conversations (for manual refresh)
  async refreshConversations() {
    return this.fetchConversations(true);
  }

  clearChat() {
    this.messages = [];
    this.conversationId = null;
  }

  async deleteConversation(conversationId) {
    try {
      await axios.delete(`${API_BASE_URL}/api/chat/${conversationId}`);
      // Remove conversation from local state
      this.conversations = this.conversations.filter(
        (convo) => convo._id !== conversationId
      );
      // If we're currently viewing this conversation, clear it
      if (this.conversationId === conversationId) {
        this.clearChat();
      }
    } catch (error) {
      console.error("Error deleting conversation:", error);
      throw error; // Re-throw to handle in UI
    }
  }
}

const chatStore = new ChatStore();
export default chatStore;
