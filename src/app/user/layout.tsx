'use client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { Providers } from "./Redux/provider";
import Navbar from "./Components/Navbar";
import { usePathname } from 'next/navigation';

export default function RootLayout({ children,}: Readonly<{children: React.ReactNode;}>) {
  const pathname=usePathname()
  const showNavbar = pathname !== '/user/signin' && pathname !== '/user/signup' && pathname !== '/user' && pathname !='/user/verify';
  return (
    <html lang="en">
      <body>
    
      
        <Providers>
        {showNavbar && <Navbar />}
        <GoogleOAuthProvider clientId="70064463542-6l3n9efafkm11avkpkbn39mr52g7f9ls.apps.googleusercontent.com">
      {children}
      </GoogleOAuthProvider>
      </Providers>
      </body>
    </html>
  );
}
