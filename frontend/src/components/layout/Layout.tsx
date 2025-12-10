import type { ReactNode } from 'react';
import Header from '../Publicwebsite/Layouts/Header';
import Footer from '../Publicwebsite/Layouts/Footer';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
