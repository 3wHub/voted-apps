import type { ReactNode } from 'react';
import Header from '@/lib/layout/components/header';
import Footer from '@/lib/layout/components/footer';

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
