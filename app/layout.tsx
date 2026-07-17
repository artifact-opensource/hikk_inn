import './globals.css';

export const metadata = {
  title: 'HikkInn — North Pakistan Hospitality Platform',
  description: 'AI-powered, web-hosted two-sided hospitality & travel platform.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
