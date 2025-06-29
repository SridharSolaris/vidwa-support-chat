import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { FaPlus, FaRegComments, FaSun, FaMoon, FaChevronDown, FaChevronRight, FaTrashAlt } from 'react-icons/fa';
import { BsLayoutSidebar } from 'react-icons/bs';
import Chat from './components/Chat';
import Admin from './components/Admin';
import ConversationHistory from './components/ConversationHistory';
import chatStore from './stores/chatStore';

const AppContent = observer(() => {
    // Initialize theme immediately based on system preference - no flash!
    const getInitialTheme = () => {
        if (typeof window !== 'undefined') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            return prefersDark ? 'dark' : 'light';
        }
        return 'light';
    };

    const [theme, setTheme] = useState(getInitialTheme);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [historyExpanded, setHistoryExpanded] = useState(false);
    const [logoAnimated, setLogoAnimated] = useState(false);
    const navigate = useNavigate();

    // Function to trigger logo animation for important operations
    const triggerLogoAnimation = () => {
        setLogoAnimated(true);
        setTimeout(() => setLogoAnimated(false), 3000); // Animation for 3 seconds
    };

    // Apply theme class immediately on mount and when theme changes
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    // Listen for system theme changes (optional - for real-time updates)
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e) => {
            setTheme(e.matches ? 'dark' : 'light');
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    // Load conversations when component mounts
    useEffect(() => {
        // Check if chatStore has a method to fetch conversations
        if (chatStore.fetchConversations) {
            chatStore.fetchConversations();
        } else if (chatStore.loadConversations) {
            chatStore.loadConversations();
        }
    }, []);

    // Handle page visibility change (when screen turns on/off or tab becomes active/inactive)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (!document.hidden && chatStore.fetchConversations) {
                console.log('Page became visible, refreshing conversations...');
                chatStore.refreshConversations();
            }
        };

        const handleFocus = () => {
            if (chatStore.fetchConversations) {
                console.log('Window focused, refreshing conversations...');
                chatStore.refreshConversations();
            }
        };

        // Add event listeners
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('focus', handleFocus);

        // Cleanup
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('focus', handleFocus);
        };
    }, []);

    return (
        <div className="font-audiowide flex flex-col h-screen bg-background dark:bg-background-dark select-none">
            <nav className="relative z-30 flex items-center px-2 sm:px-4 py-2 bg-surface/90 dark:bg-surface-dark/90 backdrop-blur-sm shadow-md border-b border-primary-dark border-opacity-20 transition-all duration-300">
                <div className="flex items-center flex-1">
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="mr-2 sm:mr-4 text-lg sm:text-xl text-text-primary dark:text-text-primary-dark focus:outline-none transition-shadow duration-200 hover:shadow-lg">
                        <BsLayoutSidebar />
                    </button>
                    <Link to="/admin" className="text-sm sm:text-base text-primary dark:text-secondary-light font-semibold hover:text-secondary transition-colors font-ubuntu">Admin</Link>
                </div>

                {/* Center logo - absolutely positioned for perfect centering */}
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className={`text-xl sm:text-2xl md:text-3xl font-bold tracking-[0.25em] transition-all duration-300 cursor-pointer select-none ${logoAnimated ? 'animate-pulse' : ''} ${theme === 'dark' ? 'drop-shadow-lg' : 'drop-shadow-md'}`} style={{
                        background: 'linear-gradient(45deg, #6366f1, #8b5cf6, #06b6d4, #6366f1)',
                        backgroundSize: '300% 300%',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        textShadow: theme === 'dark' ? '0 0 20px rgba(99, 102, 241, 0.4)' : '0 0 15px rgba(99, 102, 241, 0.2)',
                        filter: theme === 'dark' ? 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))' : 'drop-shadow(0 2px 4px rgba(99, 102, 241, 0.15))',
                        animation: logoAnimated ? 'gradientShift 2s ease-in-out infinite, subtleBounce 1.5s ease-in-out infinite' : ''
                    }}
                        onClick={() => {
                            chatStore.clearChat();
                            navigate('/');
                            triggerLogoAnimation();
                        }}
                        onMouseEnter={(e) => {
                            if (!logoAnimated) {
                                e.target.style.animation = 'gradientShift 2s ease-in-out infinite, subtleBounce 1.5s ease-in-out infinite';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!logoAnimated) {
                                e.target.style.animation = '';
                            }
                        }}>
                        VIDWA
                    </div>
                </div>

                {/* Right side - Dark mode toggle */}
                <div className="flex items-center justify-end flex-1">
                    <button
                        onClick={() => {
                            setTheme(theme === 'dark' ? 'light' : 'dark');
                            triggerLogoAnimation();
                        }}
                        className={`text-lg sm:text-xl md:text-2xl focus:outline-none transition-all duration-200 hover:shadow-lg ${theme === 'dark' ? 'text-secondary-light' : 'text-text-primary'}`}
                        aria-label="Toggle Dark Mode"
                    >
                        {theme === 'dark' ? <FaSun /> : <FaMoon />}
                    </button>
                </div>
            </nav>
            <div className="flex flex-1 overflow-hidden relative">
                {/* Mobile overlay when sidebar is open */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}
                <div className={`fixed left-0 z-20 bg-surface/95 dark:bg-surface-dark/95 backdrop-blur-sm border-r border-primary-dark border-opacity-20 transform transition-all duration-300 overflow-y-auto custom-scrollbar
                    ${sidebarOpen ? 'top-12 sm:top-16 bottom-0 translate-x-0 w-64 sm:w-64' : 'translate-x-0 w-10 sm:w-12 h-32 sm:h-40 rounded-r-lg shadow-lg hidden md:block'}
                    md:transform-none md:translate-x-0 ${sidebarOpen ? 'md:top-16 md:bottom-0 md:w-64' : 'md:w-12 md:h-40'}`}
                    style={!sidebarOpen ? { top: 'calc(50% + 24px)', transform: 'translateY(-50%)' } : {}}>
                    {sidebarOpen ? (
                        <>
                            <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-start">
                                <button onClick={() => {
                                    chatStore.clearChat();
                                    navigate('/');
                                    triggerLogoAnimation();
                                }} className="flex items-center px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors">
                                    <FaPlus className="h-5 w-5" />
                                    <span className="ml-2 font-medium font-ubuntu">New Chat</span>
                                </button>
                            </div>
                            <div className="p-3">
                                <button
                                    onClick={() => {
                                        setHistoryExpanded(!historyExpanded);
                                        // Fetch conversations when expanding history
                                        if (!historyExpanded) {
                                            chatStore.refreshConversations();
                                        }
                                    }}
                                    className="flex items-center justify-between w-full px-2 py-2 text-text-primary dark:text-text-primary-dark hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    <div className="flex items-center">
                                        <FaRegComments className="h-5 w-5" />
                                        <span className="ml-2 font-medium font-ubuntu">Chat History</span>
                                    </div>
                                    {historyExpanded ? <FaChevronDown className="h-4 w-4" /> : <FaChevronRight className="h-4 w-4" />}
                                </button>
                                {historyExpanded && (
                                    <div className="mt-2 pl-3 space-y-1 max-h-64 sm:max-h-80 md:max-h-96 overflow-y-auto custom-scrollbar relative">
                                        {/* Scroll indicator - shown when content overflows */}
                                        {chatStore.conversations.length > 8 && (
                                            <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-transparent via-primary/20 to-transparent pointer-events-none"></div>
                                        )}
                                        {chatStore.conversations.map((convo) => {
                                            const firstMessage = convo.messages?.[0]?.text || convo.messages?.[0]?.content || '';
                                            const displayText = firstMessage.length > 40
                                                ? firstMessage.substring(0, 40) + '...'
                                                : firstMessage || 'New Conversation';

                                            const handleDelete = async (e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                if (window.confirm('Are you sure you want to delete this conversation?')) {
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
                                                <div key={convo._id} className="group relative">
                                                    <Link
                                                        to={`/?id=${convo._id}`}
                                                        className="block px-2 py-1 pr-8 text-sm text-text-primary dark:text-text-primary-dark hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors"
                                                        title={firstMessage || new Date(convo.createdAt).toLocaleString()}
                                                        onClick={() => setSidebarOpen(false)} // Close sidebar on mobile when selecting conversation
                                                    >
                                                        <div className="truncate font-ubuntu leading-relaxed">
                                                            {displayText}
                                                        </div>
                                                    </Link>
                                                    <button
                                                        onClick={handleDelete}
                                                        className="absolute right-1 top-1/2 transform -translate-y-1/2 p-1 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-all duration-200"
                                                        title="Delete conversation"
                                                        aria-label="Delete conversation"
                                                    >
                                                        <FaTrashAlt className="h-3 w-3" />
                                                    </button>
                                                </div>
                                            );
                                        })}
                                        {chatStore.conversations.length === 0 && (
                                            <p className="text-sm text-gray-500 dark:text-gray-400 px-2 py-1 font-ubuntu">No conversations yet</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full py-2 sm:py-3 space-y-2 sm:space-y-3">
                            <button onClick={() => {
                                chatStore.clearChat();
                                navigate('/');
                                triggerLogoAnimation();
                            }} className="p-1.5 sm:p-2 bg-primary text-white rounded-md hover:bg-primary-light transition-colors">
                                <FaPlus className="h-3 w-3 sm:h-4 sm:w-4" />
                            </button>
                            <Link to="/history" className="p-1.5 sm:p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md" title="Chat History">
                                <FaRegComments className="h-3 w-3 sm:h-4 sm:w-4 text-text-primary dark:text-text-primary-dark" />
                            </Link>
                        </div>
                    )}
                </div>
                <div className={`flex-1 overflow-hidden transition-all duration-300 ${sidebarOpen ? 'ml-0 md:ml-64' : 'ml-0 md:ml-12'} flex justify-center`}>
                    <div className="w-full max-w-full">
                        <Routes>
                            <Route path="/" element={<Chat />} />
                            <Route path="/history" element={<ConversationHistory />} />
                            <Route path="/admin" element={<Admin />} />
                        </Routes>
                    </div>
                </div>
            </div>
        </div>
    );
});

const App = () => {
    return (
        <Router>
            <AppContent />
        </Router>
    );
};

export default App;
