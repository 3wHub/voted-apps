import { Outlet } from 'react-router-dom';
import { ReactNode } from 'react';
import Header from './components/header';
import Footer from './components/footer';

interface LayoutProps {
  children?: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex flex-grow max-w-screen justify-center my-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}