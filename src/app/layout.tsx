'use client';

import { useState, useEffect } from 'react';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [theme, setTheme] = useState<'light' | 'dark' | 'gray' | 'custom'>('light');

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark', 'gray', 'custom');
    document.documentElement.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    const themes: ('light' | 'dark' | 'gray' | 'custom')[] = ['light', 'dark', 'gray', 'custom'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <button
          onClick={toggleTheme}
          className="fixed top-4 right-4 z-50 rounded bg-primary px-4 py-2 text-primary-foreground shadow-md hover:bg-primary/90"
          aria-label="Toggle theme"
        >
          Toggle Theme
        </button>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
