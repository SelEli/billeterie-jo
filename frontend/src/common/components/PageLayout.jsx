// src/common/components/PageLayout.jsx
import Header from './Header';
import Footer from './Footer';

export default function PageLayout({ title, children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-20 pb-12 px-4 max-w-6xl mx-auto w-full">
        {title && <h1 className="text-2xl font-bold mb-6">{title}</h1>}
        {children}
      </main>
      <Footer />
    </div>
  );
}
