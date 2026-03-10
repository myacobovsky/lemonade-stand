// @ts-nocheck
import './globals.css';
import Providers from './providers';

export const metadata = {
  title: 'Lemonade Stand - Where Kids Learn Real Business',
  description: 'The safe, fun marketplace where kids run their own online store.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=Montserrat:wght@400;700&family=Pacifico&family=Sour+Gummy:wght@400;700&family=DynaPuff:wght@400;700&family=Delius&family=Emilys+Candy&family=Unica+One&family=Ultra&family=Quantico:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
