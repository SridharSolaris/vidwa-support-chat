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
            // Smooth scroll to bottom when new messages arrive
            setTimeout(() => {
                chatHistoryRef.current.scrollTo({
                    top: chatHistoryRef.current.scrollHeight,
                    behavior: 'smooth'
                });
            }, 100); // Small delay to ensure DOM is updated
        }
    }, [chatStore.messages]);

    // Also scroll when sending a message
    const handleSendMessage = () => {
        if (message.trim()) {
            chatStore.sendMessage(message);
            setMessage('');
            // Immediate scroll for user message, then another for AI response
            setTimeout(() => {
                if (chatHistoryRef.current) {
                    chatHistoryRef.current.scrollTo({
                        top: chatHistoryRef.current.scrollHeight,
                        behavior: 'smooth'
                    });
                }
            }, 50);
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
        <div className="w-full h-full flex items-center justify-center p-0 sm:p-4">
            <div className="flex flex-col max-w-4xl w-full bg-surface/90 dark:bg-surface-dark/90 backdrop-blur-sm rounded-none sm:rounded-lg shadow-lg border-0 sm:border border-primary-dark border-opacity-20 h-[calc(100vh-3rem)] sm:h-[calc(100vh-5rem)] md:h-[calc(100vh-6rem)] lg:h-[calc(100vh-7.5rem)]">
                <div className="flex-shrink-0 p-2 sm:p-4 border-b border-primary-dark border-opacity-20 flex justify-between items-center bg-surface/50 dark:bg-surface-dark/50 backdrop-blur-sm">
                    <h2 className="text-lg sm:text-xl font-bold text-text-primary dark:text-text-primary-dark tracking-[0.1em]">SUPPORT CHAT</h2>
                    <button onClick={handleDownloadChat} className="px-2 py-1 sm:px-4 sm:py-2 bg-primary/90 dark:bg-primary-dark/90 text-white rounded-lg text-xs sm:text-sm font-semibold hover:bg-primary hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 backdrop-blur-sm border border-primary-light border-opacity-30">
                        <span className="hidden sm:inline">Export Chat</span>
                        <span className="sm:hidden">Export</span>
                    </button>
                </div>
                <div className="flex-1 min-h-0 p-2 sm:p-4 md:p-6 overflow-y-auto flex flex-col gap-2 sm:gap-3 md:gap-4 custom-scrollbar" ref={chatHistoryRef} style={{
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.02), rgba(139, 92, 246, 0.02))'
                }}>
                    {chatStore.messages.map((msg, index) => {
                        const isLastMessage = index === chatStore.messages.length - 1;
                        const isAIResponse = msg.sender === 'assistant' || msg.sender === 'bot';
                        const animationClass = isAIResponse && isLastMessage ? 'ai-response' : 'animate-slideIn';

                        return (
                            <div
                                key={index}
                                className={`flex flex-col max-w-[90%] sm:max-w-[85%] md:max-w-[80%] p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-md backdrop-blur-sm border transition-all duration-500 hover:shadow-lg ${animationClass} ${msg.sender === 'user'
                                    ? 'self-end bg-primary/10 dark:bg-primary-dark/20 border-primary/20 dark:border-primary-dark/30'
                                    : 'self-start bg-surface/60 dark:bg-surface-dark/60 border-gray-200/30 dark:border-gray-600/30'
                                    }`}
                                style={{
                                    animationDelay: isLastMessage ? '0ms' : `${index * 100}ms`,
                                    animationFillMode: 'both'
                                }}
                            >
                                <div className={`text-xs font-semibold mb-2 tracking-wider ${msg.sender === 'user' ? 'text-primary dark:text-primary-light' : 'text-text-secondary dark:text-text-secondary-dark'
                                    }`}>
                                    {msg.sender === 'user' ? 'YOU' : 'VIDWA AI'}
                                </div>
                                <p className="text-xs sm:text-sm text-text-primary dark:text-text-primary-dark leading-relaxed font-ubuntu">{msg.text}</p>
                            </div>
                        );
                    })}
                </div>
                <div className="flex-shrink-0 p-2 sm:p-4 border-t border-primary-dark border-opacity-20 bg-surface/50 dark:bg-surface-dark/50 backdrop-blur-sm">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Type your message..."
                            className="flex-1 px-3 py-2 sm:px-4 sm:py-3 border border-primary/30 dark:border-primary-dark/40 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-200 bg-surface/80 dark:bg-surface-dark/80 text-text-primary dark:text-text-primary-dark placeholder-text-secondary/60 dark:placeholder-text-secondary-dark/60 backdrop-blur-sm font-ubuntu select-text"
                        />
                        <button
                            onClick={handleSendMessage}
                            className="px-3 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-primary to-primary-light dark:from-primary-dark dark:to-primary text-white rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 backdrop-blur-sm border border-primary-light/30 tracking-[0.05em]"
                        >
                            SEND
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default Chat;
