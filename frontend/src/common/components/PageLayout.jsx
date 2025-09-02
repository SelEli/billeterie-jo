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
  const maxWidth =
    containerSize === 'sm' ? 'max-w-sm' :
    containerSize === 'lg' ? 'max-w-lg' :
    containerSize === 'md' ? 'max-w-md' :
    '';

  return (
    <div className="min-h-screen flex flex-col">
      {!hideHeader && <Header />}

      <main
        className={[
          'flex-1',
          hideHeader ? '' : 'pt-20',
          'pb-12',
          fullWidth ? '' : 'px-4 max-w-6xl mx-auto w-full',
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
