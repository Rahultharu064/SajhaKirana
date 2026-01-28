import React from 'react';
import ChatWindow from '../../components/chatbot/ChatWindow';
import Header from '../../components/Publicwebsite/Layouts/Header';
import Footer from '../../components/Publicwebsite/Layouts/Footer';

const SajhaKiranaChatbot: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8">
                <ChatWindow />
            </main>
            <Footer />
        </div>
    );
};

export default SajhaKiranaChatbot;
