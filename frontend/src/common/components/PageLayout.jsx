// src/common/components/PageLayout.jsx
import Header from './Header';
import Footer from './Footer';

export default function PageLayout({
  title,
  subtitle,
  children,
  fullWidth = false,
  hideHeader = false,
  hideFooter = false,
  containerSize, // 'sm' | 'md' | 'lg'
  gap = '4',
}) {
  // Largeurs plus généreuses et cohérentes
  const maxWidth =
    containerSize === 'sm' ? 'max-w-xl' :   // ~36rem / 576px
    containerSize === 'md' ? 'max-w-4xl' :  // ~56rem / 896px
    containerSize === 'lg' ? 'max-w-7xl' :  // ~80rem / 1280px
    '';

  return (
    <div className="min-h-screen flex flex-col">
      {!hideHeader && <Header />}

      <main
        className={[
          'flex-1',
          hideHeader ? '' : 'pt-20',
          'pb-12',
          fullWidth
            ? 'px-4 w-full' // pleine largeur avec marges responsives
            : 'px-4 max-w-7xl mx-auto w-full', // largeur par défaut plus large
        ].join(' ')}
      >
        {title && (
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-white drop-shadow">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-2 text-white/85 drop-shadow-sm">{subtitle}</p>
            )}
          </header>
        )}

        {maxWidth ? (
          <div className={`${maxWidth} mx-auto space-y-${gap} w-full`}>
            {children}
          </div>
        ) : (
          children
        )}
      </main>

      {!hideFooter && <Footer />}
    </div>
  );
}
