import React, { useState, useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { useLocation } from 'react-router-dom';
import chatStore from '../stores/chatStore';

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
}

const Chat = observer(() => {
    const [message, setMessage] = useState('');
    const chatHistoryRef = useRef(null);
    const query = useQuery();
    const conversationId = query.get('id');

    useEffect(() => {
        if (conversationId) {
            chatStore.fetchHistory(conversationId);
        }
    }, [conversationId]); // fetch history when ID changes

    // Clear chat only once on mount if no conversation ID
    useEffect(() => {
        if (!conversationId) {
            chatStore.clearChat();
        }
    }, []);

    useEffect(() => {
        if (chatHistoryRef.current) {
            chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
        }
    }, [chatStore.messages]);

    const handleSendMessage = () => {
        if (message.trim()) {
            chatStore.sendMessage(message);
            setMessage('');
        }
    };

    const handleDownloadChat = () => {
        const chatContent = chatStore.messages
            .map(msg => `${msg.sender.toUpperCase()}: ${msg.text}`)
            .join('\n');
        const blob = new Blob([chatContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chat-history-${chatStore.conversationId || 'new'}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="flex-1 flex flex-col max-w-3xl w-full mx-auto bg-surface rounded-lg shadow-lg overflow-hidden my-4">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <h2 className="text-xl font-bold text-text-primary">Chat</h2>
                <button onClick={handleDownloadChat} className="px-4 py-2 bg-gray-200 text-text-secondary rounded-full text-sm font-semibold hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400">
                    Download Chat
                </button>
            </div>
            <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-3" ref={chatHistoryRef}>
                {chatStore.messages.map((msg, index) => (
                    <div key={index} className={`flex flex-col max-w-[70%] p-3 rounded-2xl ${msg.sender === 'user' ? 'self-end bg-user-message' : 'self-start bg-bot-message'}`}>
                        <p className="text-sm text-text-primary">{msg.text}</p>
                    </div>
                ))}
            </div>
            <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
                    />
                    <button onClick={handleSendMessage} className="ml-3 px-6 py-3 bg-primary text-white rounded-full text-sm font-semibold hover:bg-opacity-80 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
});

export default Chat;
