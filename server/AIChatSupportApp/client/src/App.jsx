import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Chat from './components/Chat';
import Admin from './components/Admin';
import ConversationHistory from './components/ConversationHistory';
import chatStore from './stores/chatStore';

function App() {
    return (
        <Router>
            <div className="flex flex-col h-screen bg-background">
                <nav className="flex items-center p-4 bg-surface shadow-md border-b border-gray-200">
                    <Link to="/" className="text-primary font-semibold mr-4 hover:text-secondary transition-colors">Chat</Link>
                    <Link to="/history" className="text-primary font-semibold mr-4 hover:text-secondary transition-colors">History</Link>
                    <Link to="/admin" className="text-primary font-semibold mr-4 hover:text-secondary transition-colors">Admin</Link>
                    <button onClick={() => chatStore.clearChat()} className="ml-auto px-4 py-2 border border-primary text-primary rounded-full hover:bg-primary hover:text-surface transition-colors">
                        New Chat
                    </button>
                </nav>
                <Routes>
                    <Route path="/" element={<Chat />} />
                    <Route path="/history" element={<ConversationHistory />} />
                    <Route path="/admin" element={<Admin />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
