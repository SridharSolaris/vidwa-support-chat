import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import chatStore from '../stores/chatStore';

const ConversationHistory = observer(() => {
    useEffect(() => {
        chatStore.fetchConversations();
    }, []);

    return (
        <div className="max-w-3xl mx-auto my-4 p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-blue-500 border-b-2 border-blue-500 pb-2 mb-4">Conversation History</h2>
            <ul className="divide-y divide-gray-200">
                {chatStore.conversations.map((convo) => (
                    <li key={convo._id} className="py-4 hover:bg-gray-50 transition-colors">
                        <Link to={`/?id=${convo._id}`} className="text-gray-800 font-semibold">
                            Conversation from {new Date(convo.createdAt).toLocaleString()}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
});

export default ConversationHistory;
