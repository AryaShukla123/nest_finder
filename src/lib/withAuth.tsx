"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; 

export function withAuth(Component: any) {
  return function ProtectedRoute(props: any) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      
      const token = localStorage.getItem('token');
      
      if (!token) {
        router.push('/auth/signin');
      } else {
        setLoading(false);
      }
    }, [router]);

    
    if (loading) {
      return null; 
    }

    return <Component {...props} />;
  };
}