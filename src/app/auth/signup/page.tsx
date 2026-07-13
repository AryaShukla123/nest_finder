"use client";

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../../../styles/auth.module.css';

export default function SignUp() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: formData.fullName,
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Registration failed');
      }

      // Auto login after signup
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Sign Up - Real Estate</title>
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
                  <h2 className={styles.logo}>🏠 RealEstate</h2>
                </div>

                <h1 className={styles.heading}>Create Account</h1>
                <p className={styles.subheading}>Get started by creating your account.</p>

                {error && (
                  <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium mb-1">Full Name</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      id="name"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                    />
                  </div>

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

                  <div className="mb-6">
                    <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      id="password"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? 'Creating Account...' : 'Sign Up'}
                  </button>

                  <p className={`${styles.switchText} mt-4 text-center`}>
                    Already have an account? <Link href="/auth/signin" className="text-blue-600 hover:underline">Sign In</Link>
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