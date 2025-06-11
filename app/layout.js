
export const metadata = {
  title: 'JBD Builder',
  description: 'Build your Job By Design',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 20, fontFamily: 'sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
