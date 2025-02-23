"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import UserLogin from '@/components/UserLogin';

export default function UserLoginPage() {
  const router = useRouter();

  const handleLoginSuccess = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-20 px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Welcome Back!</h1>
            <p className="text-gray-600">Sign in to continue your journey</p>
          </div>

          <UserLogin onSuccess={handleLoginSuccess} />

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link href="/user/signup" className="text-green-600 hover:text-green-700">
                Sign up here
              </Link>
            </p>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Are you an organization?{' '}
              <Link href="/organization/login" className="text-blue-600 hover:text-blue-700">
                Sign in as organization
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 