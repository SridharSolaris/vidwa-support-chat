import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import { FaRegComments, FaChevronRight, FaTrashAlt, FaSync } from 'react-icons/fa';
import chatStore from '../stores/chatStore';

const ConversationHistory = observer(() => {
    useEffect(() => {
        // Always refresh when visiting the history page
        if (chatStore.refreshConversations) {
            chatStore.refreshConversations();
        } else {
            chatStore.fetchConversations();
        }
    }, []);

    return (
        <div className="w-full h-full flex items-center justify-center p-1 sm:p-2 md:p-4">
            <div className="max-w-4xl w-full bg-surface/90 dark:bg-surface-dark/90 backdrop-blur-sm rounded-none sm:rounded-lg shadow-lg border-0 sm:border border-primary-dark border-opacity-20 p-3 sm:p-4 md:p-6 overflow-visible" style={{
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.02), rgba(139, 92, 246, 0.02))'
            }}>
                <div className="flex items-center justify-between border-b-2 border-primary/30 dark:border-primary-dark/40 pb-3 sm:pb-4 mb-4 sm:mb-6">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <FaRegComments className="text-xl sm:text-2xl text-primary dark:text-primary-light" />
                        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-primary dark:text-primary-light tracking-[0.1em] font-audiowide">
                            <span className="hidden sm:inline">CONVERSATION HISTORY</span>
                            <span className="sm:hidden">CHAT HISTORY</span>
                        </h2>
                    </div>
                    <button
                        onClick={() => chatStore.refreshConversations()}
                        disabled={chatStore.isLoadingConversations}
                        className={`flex items-center gap-1 sm:gap-2 px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm rounded-lg transition-colors font-ubuntu ${chatStore.isLoadingConversations
                            ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                            : 'bg-primary/10 dark:bg-primary-dark/20 text-primary dark:text-primary-light hover:bg-primary/20 dark:hover:bg-primary-dark/30'
                            }`}
                        title="Refresh conversations"
                    >
                        <FaSync className={`h-3 w-3 sm:h-4 sm:w-4 ${chatStore.isLoadingConversations ? 'animate-spin' : ''}`} />
                        <span className="hidden sm:inline">
                            {chatStore.isLoadingConversations ? 'Refreshing...' : 'Refresh'}
                        </span>
                    </button>
                </div>

                {/* Error message */}
                {chatStore.conversationsError && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4">
                        <p className="text-red-600 dark:text-red-400 text-sm font-ubuntu">
                            Failed to load conversations. Please check your connection and try refreshing.
                        </p>
                    </div>
                )}

                {chatStore.conversations.length === 0 ? (
                    <div className="text-center py-8 sm:py-12">
                        <FaRegComments className="text-4xl sm:text-5xl md:text-6xl text-text-secondary/30 dark:text-text-secondary-dark/30 mx-auto mb-3 sm:mb-4" />
                        <p className="text-text-secondary dark:text-text-secondary-dark text-base sm:text-lg font-ubuntu">No conversations yet</p>
                        <p className="text-text-secondary/70 dark:text-text-secondary-dark/70 text-xs sm:text-sm mt-1 sm:mt-2 font-ubuntu px-4">Start a new chat to see your conversation history</p>
                    </div>
                ) : (
                    <div className="space-y-3 sm:space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar px-1 py-2">
                        {chatStore.conversations.map((convo, index) => {
                            const firstMessage = convo.messages?.[0]?.text || convo.messages?.[0]?.content || '';
                            const maxLength = window.innerWidth < 640 ? 40 : 60;
                            const displayText = firstMessage.length > maxLength
                                ? firstMessage.substring(0, maxLength) + '...'
                                : firstMessage || 'New Conversation';

                            const handleDelete = async (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (window.confirm('Are you sure you want to delete this conversation? This action cannot be undone.')) {
                                    try {
                                        await chatStore.deleteConversation(convo._id);
                                        // Success feedback could be added here if needed
                                    } catch (error) {
                                        console.error('Delete error:', error);
                                        const errorMessage = error.response?.data?.error || 'Failed to delete conversation. Please try again.';
                                        alert(errorMessage);
                                    }
                                }
                            };

                            return (
                                <div key={convo._id} className="group relative mx-1">
                                    <Link
                                        to={`/?id=${convo._id}`}
                                        className="block p-3 sm:p-4 bg-surface/60 dark:bg-surface-dark/60 backdrop-blur-sm rounded-lg border border-gray-200/30 dark:border-gray-600/30 hover:border-primary/40 dark:hover:border-primary-dark/50 hover:shadow-lg hover:bg-surface/80 dark:hover:bg-surface-dark/80 transition-all duration-200 group-hover:scale-[1.02] origin-center"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1 min-w-0 pr-8">
                                                <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                                                    <span className="text-xs font-semibold text-primary dark:text-primary-light tracking-wider">
                                                        <span className="hidden sm:inline">CONVERSATION #{String(index + 1).padStart(3, '0')}</span>
                                                        <span className="sm:hidden">#{String(index + 1).padStart(2, '0')}</span>
                                                    </span>
                                                </div>
                                                <h3 className="text-text-primary dark:text-text-primary-dark font-semibold text-sm mb-1 font-ubuntu truncate" title={firstMessage}>
                                                    {displayText}
                                                </h3>
                                                <p className="text-text-secondary dark:text-text-secondary-dark text-xs font-ubuntu">
                                                    <span className="hidden sm:inline">{new Date(convo.createdAt).toLocaleDateString()} at {new Date(convo.createdAt).toLocaleTimeString()}</span>
                                                    <span className="sm:hidden">{new Date(convo.createdAt).toLocaleDateString()}</span>
                                                </p>
                                                <div className="flex items-center gap-2 mt-1 sm:mt-2">
                                                    <span className="text-xs text-text-secondary/70 dark:text-text-secondary-dark/70 font-ubuntu">
                                                        {convo.messages?.length || 0} <span className="hidden sm:inline">messages</span><span className="sm:hidden">msgs</span>
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <FaChevronRight className="text-text-secondary/50 dark:text-text-secondary-dark/50 group-hover:text-primary dark:group-hover:text-primary-light transition-colors duration-200 flex-shrink-0" />
                                            </div>
                                        </div>
                                    </Link>
                                    <button
                                        onClick={handleDelete}
                                        className="absolute top-2 right-2 p-2 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 z-10"
                                        title="Delete conversation"
                                        aria-label="Delete conversation"
                                    >
                                        <FaTrashAlt className="h-4 w-4" />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
});

export default ConversationHistory;
