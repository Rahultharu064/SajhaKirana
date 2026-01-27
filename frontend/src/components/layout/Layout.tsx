import type { ReactNode } from 'react';
import Header from '../Publicwebsite/Layouts/Header';
import Footer from '../Publicwebsite/Layouts/Footer';
import ChatFloatingButton from '../chatbot/ChatFloatingButton';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>{children}</main>
      <ChatFloatingButton />
      <Footer />
    </div>
  );
};

export default Layout;
