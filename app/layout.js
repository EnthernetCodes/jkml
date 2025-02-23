import "./globals.css";

export const metadata = {
  title: "Files",
  description: "Read, download, edit, and create pdfs with adobe" ,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        </body>
    </html>
  );
}
 