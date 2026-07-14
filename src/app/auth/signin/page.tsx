"use client";

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import Link from 'next/link';
import styles from '@/styles/auth.module.css';
import {
  IconHome,
  IconMenu,
  IconClose,
} from "@/components/icons";

export default function SignIn() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/login", {
        method: "POST",
        headers: {
       "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: formData.email,
    password: formData.password,
  }),
});

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Login failed');
      }

      // Store token
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Redirect to dashboard or home
      router.push('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
  <>
    <Head>
      <title>Sign In - Real Estate</title>
    </Head>

    <div className={styles.authContainer}>
      
      <div className="w-full h-screen">
        <div className="flex h-full">
          
          {/* Left Side - Pattern (Hidden on mobile, visible on desktop) */}
          <div className={`hidden lg:block lg:w-1/2 ${styles.leftPanel}`}>
  <div className={styles.patternOverlay}>
    {/* Clean, inspiring real estate copywriting */}
    <h1 className={styles.welcomeTitle}>
      Find your perfect <br /> place to call home.
    </h1>
    <p className={styles.welcomeText}>
      Discover thousands of premium listings, tailored matching, and seamless agent connections all in one place.
    </p>
  </div>
</div>

          {/* Right Side - Form */}
          <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
            <div className={styles.formWrapper}>
              <div className={styles.logoSection}>
                <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <span className="w-9 h-9 bg-primary rounded-[9px] flex items-center justify-center text-white text-base">
            <IconHome />
          </span>
          <span className="text-lg font-bold text-ink tracking-tight">
            Nest<span className="text-primary">Finder</span>
          </span>
        </Link>
              </div>

              <h1 className={styles.heading}>Sign In</h1>
              <p className={styles.subheading}>Welcome back! Please enter your details.</p>

              {error && (
                <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    id="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    id="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>

                <div className="flex justify-end mb-4">
                  <Link href="/auth/forgot-password" className={styles.forgotLink}>
                    Forgot Password?
                  </Link>
                </div>

                <button 
                  type="submit" 
                  className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </button>

                <p className={`${styles.switchText} mt-4 text-center`}>
                  Don't have an account? <Link href="/auth/signup" className="text-blue-600 hover:underline">Sign Up</Link>
                </p>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  </>
);
}