"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import Header from '@/components/Header';
import Link from 'next/link';

export default function OrganizationLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Check if user is an NGO
      const usersRef = collection(db, "users");
      const q = query(usersRef, 
        where("uid", "==", userCredential.user.uid),
        where("role", "==", "ngo")
      );
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        // Not an NGO user
        await auth.signOut();
        setError("This account is not registered as an organization");
        return;
      }

      // Get NGO details
      const userData = querySnapshot.docs[0].data();
      const ngoDoc = await getDoc(doc(db, "ngos", userData.ngoId));
      
      if (!ngoDoc.exists()) {
        await auth.signOut();
        setError("Organization details not found");
        return;
      }

      // Successful login - redirect to organization dashboard or events page
      router.push('/organization/events');
    } catch (error: any) {
      console.error("Login error:", error);
      setError(
        error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password'
          ? 'Invalid email or password'
          : 'Failed to login. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-20 px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">
              Organization Login
            </h1>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border rounded-md focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border rounded-md focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 text-center space-y-2">
              <p className="text-sm text-gray-600">
                Don't have an organization account?{' '}
                <Link href="/ngo/register" className="text-green-600 hover:text-green-700">
                  Register here
                </Link>
              </p>
              <Link 
                href="/forgot-password"
                className="block text-sm text-blue-600 hover:text-blue-700"
              >
                Forgot your password?
              </Link>
            </div>

            <div className="mt-8 pt-6 border-t">
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h2 className="font-medium text-yellow-800 mb-2">Note:</h2>
                <p className="text-sm text-yellow-700">
                  This login is only for registered organizations. If you're a volunteer, please use the regular login.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 