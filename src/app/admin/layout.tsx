
'use client'
import Navbar from './components/Navbar' 
import { usePathname } from 'next/navigation';


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Conditionally render the navbar only if not on the login page
  const showNavbar = pathname !== '/admin'; 

  return (
    <html lang="en">
      <body>
        {showNavbar && <Navbar />} {/* Show Navbar only if not on /user/login */}
        {children}
      </body>
    </html>
  );
}
