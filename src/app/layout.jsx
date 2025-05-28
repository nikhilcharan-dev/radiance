import "./globals.css";

export const metadata = {
    title: "Nova in Space | Portfolio",
    description: "Explore Nova\'s 3D portfolio in space!",
};

export default function RootLayout({ children }) {
  return (
      <html lang="en">
        <body className="h-screen w-screen">
            {children}
        </body>
      </html>
  );
}
