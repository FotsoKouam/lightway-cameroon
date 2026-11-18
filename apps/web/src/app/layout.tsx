import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'LightWay Cameroon',
  description: 'GPS camerounais orienté prévention routière',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
